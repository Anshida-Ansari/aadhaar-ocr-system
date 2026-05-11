import { injectable } from "inversify";
import Tesseract from "tesseract.js";
import { IOcrEngine } from "./IOcrEngine.js";

@injectable()
export class TesseractEngine implements IOcrEngine {
  async extractText(imageBuffer: Buffer): Promise<string> {
    try {
      const {
        data: { text },

      } = await Tesseract.recognize(imageBuffer, "eng+mal");

      return text;
    } catch (error) {
      throw new Error("OCR Engine failed to extract text");
    }
  }
}