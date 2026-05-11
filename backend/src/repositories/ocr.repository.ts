import { injectable } from "inversify";
import OcrResultModel from "../models/OcrResult.model.js";
import { OcrResult } from "../types/ocr.result.js";
import { IOcrRepository } from "./IOcr.repository.js";


@injectable()
export class OcrRepository implements IOcrRepository {
  async save(result: OcrResult): Promise<OcrResult> {
    const newResult = new OcrResultModel(result);
    return await newResult.save();
  }
}