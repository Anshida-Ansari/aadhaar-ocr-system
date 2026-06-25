import { injectable } from "inversify";
import Tesseract from "tesseract.js";
import { IOcrEngine } from "./IocrEngine.js";

@injectable()
export class TesseractEngine implements IOcrEngine {
  private _worker: Tesseract.Worker | null = null;

  async init(): Promise<void> {
    if (this._worker) return;
    this._worker = await Tesseract.createWorker("eng+mal", 1, {
      logger: () => { }, 
    });
    console.log("[TesseractEngine] Worker initialized and ready.");
  }

  async extractText(imageBuffer: Buffer): Promise<string> {
    if (!this._worker) await this.init();

    try {
      const {
        data: { text },
      } = await this._worker!.recognize(imageBuffer);
      return text;
    } catch (error) {
      throw new Error("OCR Engine failed to extract text");
    }
  }
}