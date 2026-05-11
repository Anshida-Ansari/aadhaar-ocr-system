import { OcrResult } from "../types/ocr.result.js";

export interface IOcrService {
   processAndSaveOcr(frontBuffer: Buffer, backBuffer: Buffer): Promise<OcrResult>;
}