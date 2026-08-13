import { injectable } from "inversify";
import Tesseract from "tesseract.js";
import { IOcrEngine } from "./IocrEngine.js";

@injectable()
export class TesseractEngine implements IOcrEngine {
  async extractText(imageBuffer: Buffer): Promise<string> {
    try {
      const {
        data: { text },

      } = await Tesseract.recognize(imageBuffer, "eng+mal", {
        langPath: "./"
      });

      return text;
    } catch (error: any) {
      console.error("OCR Error details:", error);
      throw new Error(`OCR Engine failed to extract text: ${error?.message || error}`);
    }
  }
}