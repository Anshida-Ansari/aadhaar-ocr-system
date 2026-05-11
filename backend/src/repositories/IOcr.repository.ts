import { OcrResult } from "../types/ocr.result.js";

export interface IOcrRepository {
  save(result: OcrResult): Promise<OcrResult>;
}