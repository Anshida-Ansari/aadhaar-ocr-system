
import { injectable } from "inversify";
import { OcrResult, OcrResultDTO } from "../types/ocr.result.js";

@injectable()
export class OcrMapper {
  toDTO(ocr: OcrResult): OcrResultDTO {
    return {
      aadhaarNumber: ocr.aadhaarNumber,
      name: ocr.name,
      dob: ocr.dob,
      address: ocr.address,
      gender: ocr.gender,
      pincode: ocr.pincode,
    };
  }
}