import { injectable } from "inversify";
import { OcrResult } from "../types/ocr.result.js";

@injectable()
export class AadhaarParser {

  private aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
  private dobRegex = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/;

  private NOISE: RegExp[] = [
    /government of india/i, /uidai/i, /gov\.in/i, /www/i, /help/i,
    /आधार|भारत सरकार|भारतीय विशिष्ट पहचान प्राधिकरण/i,
    /unique identifica|identification authority/i,
    /QR Code/i, /VID/i, /AADHAAR/i,
    /^address[:：]?\s*$/i, /^पता[:：]?\s*$/i,
    /\d{4}\s?\d{4}\s?\d{4}/,
    /\d{2}[\/\-]\d{2}[\/\-]\d{4}/,
    /male|female|other|dob|जन्म|1947|1800|customer|toll\s*free/i,
    /\bset\b/i, /\bfem\b/i
  ];

  private isGarbageLine(line: string): boolean {
    const words = line.match(/[a-zA-Z]+/g) || [];
    if (words.length < 3) return false;

    const veryShort = words.filter(w => w.length <= 2);
    const short = words.filter(w => w.length <= 3);
    const realWords = words.filter(w => w.length >= 4);
    if (realWords.length >= 2) return false;

    if (veryShort.length >= 3 && realWords.length <= 1) return true;
    if (short.length / words.length > 0.55) return true;

    return false;
  }

  // 🔹 Helper: noise filter
  private isNoise(text: string): boolean {
    return this.NOISE.some((r) => r.test(text));
  }

  // 🔹 FRONT PARSER
  public parseFront(text: string): Partial<OcrResult> {
    const data: Partial<OcrResult> = {};
    const lines = this.getCleanLines(text);

    // Aadhaar
    const aadhaarMatch = text.match(this.aadhaarRegex);
    data.aadhaarNumber = aadhaarMatch?.[0].replace(/\s+/g, "") || undefined;

    // DOB
    const dobMatch = text.match(this.dobRegex);
    data.dob = dobMatch?.[1]?.replace(/-/g, "/") || undefined;

    // Gender
    const genderMatch = text.match(/(male|female|other|transgender)/i);
    data.gender = genderMatch
      ? this.capitalize(genderMatch[0])
      : undefined;

    // Name extraction
    data.name = this.extractName(lines, data.dob);

    return data;
  }

  // 🔹 BACK PARSER
  public parseBack(text: string): Partial<OcrResult> {
    const data: Partial<OcrResult> = {};

    // Aadhaar (fallback)
    const aadhaarMatch = text.match(this.aadhaarRegex);
    data.aadhaarNumber = aadhaarMatch?.[0].replace(/\s+/g, "") || undefined;

    // Address — pass raw text; new extractAddress works on full string
    const address = this.extractAddress(text);
    if (address) {
      data.address = this.cleanAddress(address);
    }

    // Pincode
    data.pincode = this.extractPincode(text, data.address);

    return data;
  }

  // 🔹 COMMON HELPERS

  private getCleanLines(text: string): string[] {
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  private capitalize(value: string): string {
    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  // 🔹 NAME LOGIC
  private extractName(lines: string[], dob?: string): string | undefined {
    let name = "";

    if (dob) {
      const dobIndex = lines.findIndex((l) => l.includes(dob));
      if (dobIndex > 0) {
        const candidate = lines[dobIndex - 1];
        if (!this.isNoise(candidate)) {
          name = candidate.replace(/[^a-zA-Z\s]/g, "").trim();
        }
      }
    }

    if (!name) {
      name =
        lines.find(
          (l) =>
            /^[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(l) &&
            !this.isNoise(l)
        ) || "";
    }

    return name || undefined;
  }

  // 🔹 ADDRESS LOGIC
  // Strategy: work at the comma-segment level, not line level.
  // Commas survive OCR perfectly; lines are full of mixed garbage.
  // For each comma-segment we extract only "real" English tokens.
  public extractAddress(rawText: string): string | undefined {
    // 1. Find where "Address:" starts in the full raw text
    const addrMatch = rawText.match(/\baddress\b[:：]?\s*/i);
    if (!addrMatch || addrMatch.index === undefined) return undefined;

    // 2. Extract everything from "Address:" onwards
    let block = rawText.slice(addrMatch.index + addrMatch[0].length);

    // 3. Strip non-ASCII (Malayalam/regional unicode → cleaned out)
    block = block.replace(/[^\x00-\x7F]/g, " ");

    // 4. Truncate at the pincode — address ends there
    const pinMatch = block.match(/\b(\d{6})\b/);
    if (pinMatch && pinMatch.index !== undefined) {
      block = block.slice(0, pinMatch.index);
    }

    // 5. Remove characters that never appear in valid Indian addresses
    block = block.replace(/[^a-zA-Z0-9,\/:\-\s]/g, " ");

    // 6. Split by comma — each segment is one address component
    const segments = block.split(",");
    const kept: string[] = [];

    for (const seg of segments) {
      const result = this.extractSegmentContent(seg);
      if (result) kept.push(result);
    }

    return kept.length ? kept.join(", ") : undefined;
  }

  /**
   * From a single comma-segment (e.g. " gL ay BH S Poonthiruthi House"),
   * extract only the meaningful English address tokens.
   *
   * Rules:
   *  - REAL word: 4+ alphabetic characters (House, Poongode, Abdulla…)
   *  - KEEP: Indian address prefixes (D/O, S/O, W/O, C/O)
   *  - KEEP: single UPPERCASE letter adjacent to a REAL word (e.g. "S" in "S Poonthiruthi")
   *  - KEEP: "P O" / "P.O" — single uppercase P or O adjacent to a real word
   *  - DISCARD: everything else (1-3 char lowercase/mixed-case OCR artifacts)
   */
  private extractSegmentContent(seg: string): string | undefined {
    const tokens = seg
      .replace(/[^\x00-\x7F]/g, " ")           // strip non-ASCII
      .replace(/[^a-zA-Z0-9\/:\-\s]/g, " ")    // strip invalid chars
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean);

    if (!tokens.length) return undefined;

    // Mark which tokens are "real"
    const isReal = (t: string): boolean => {
      const alpha = t.replace(/[^a-zA-Z]/g, "");
      if (alpha.length >= 4) return true;                    // proper word
      if (/^[DSWHC]\/O:?$/i.test(t)) return true;          // D/O, S/O, W/O…
      return false;
    };

    // Mark which tokens are "keep-if-adjacent" (single uppercase letter)
    const isAdjacentKeep = (t: string): boolean =>
      /^[A-Z]$/.test(t.replace(/[^a-zA-Z]/g, ""));         // e.g. "S", "P", "O"

    const realIndices = new Set(
      tokens.map((t, i) => (isReal(t) ? i : -1)).filter(i => i >= 0)
    );

    if (realIndices.size === 0) return undefined; // no real word → discard segment

    // Collect real tokens + adjacent uppercase initials
    const kept: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
      if (realIndices.has(i)) {
        kept.push(tokens[i]);
      } else if (
        isAdjacentKeep(tokens[i]) &&
        (realIndices.has(i - 1) || realIndices.has(i + 1) ||
          realIndices.has(i - 2) || realIndices.has(i + 2))
      ) {
        kept.push(tokens[i]);
      }
    }

    const result = kept.join(" ").trim();
    return result.length > 1 ? result : undefined;
  }

  // 🔹 PINCODE LOGIC
  private extractPincode(
    text: string,
    address?: string
  ): string | undefined {
    const pinMatch = text.match(/-\s*(\d{6})/);
    if (pinMatch) return pinMatch[1];

    const pins = Array.from(
      text.matchAll(/\b\d{6}\b/g)
    ).map((m) => m[0]);

    return pins.length ? pins[pins.length - 1] : undefined;
  }

  // 🔹 CLEAN ADDRESS — just normalise spacing/commas; extraction is already clean
  private cleanAddress(raw: string): string {
    return raw
      .replace(/\s*,\s*/g, ", ")
      .replace(/,{2,}/g, ",")
      .replace(/^,|,$/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
}