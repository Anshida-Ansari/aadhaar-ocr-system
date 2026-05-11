import { injectable, inject } from "inversify";

import { IOcrService } from "./Iocr.service.js";
import { IOcrRepository } from "../repositories/Iocr.repository.js";
import { IOcrEngine } from "./IocrEngine.js";

import { TYPES } from "../inversify/type.js";
import { OcrResult } from "../types/ocr.result.js";
import { AadhaarParser } from "../utils/aadhaar.parser.js";
import { OcrMapper } from "../utils/dto.mapper.js";


@injectable()
export class OcrService implements IOcrService {
  constructor(
    @inject(TYPES.IOcrRepository) private ocrRepository: IOcrRepository,
    @inject(TYPES.IOcrEngine) private ocrEngine: IOcrEngine,
    @inject(TYPES.AadhaarParser) private parser: AadhaarParser,
    @inject(TYPES.OcrMapper) private mapper: OcrMapper
  ) {}

  async processAndSaveOcr(
    frontBuffer: Buffer,
    backBuffer: Buffer
  ): Promise<OcrResult> {

    const [frontText, backText] = await Promise.all([
      this.ocrEngine.extractText(frontBuffer),
      this.ocrEngine.extractText(backBuffer),
    ]);

    const frontData = this.parser.parseFront(frontText);



    const backData = this.parser.parseBack(backText);

    const merged: OcrResult = {
      aadhaarNumber: frontData.aadhaarNumber ?? backData.aadhaarNumber,
      name: frontData.name,
      dob: frontData.dob,
      gender: frontData.gender,
      address: backData.address,
      pincode: backData.pincode,
    };

    const saved = await this.ocrRepository.save(merged);

    return this.mapper.toDTO(saved);
  }
}