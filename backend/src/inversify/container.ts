import { Container, ContainerModule } from "inversify";
import { TYPES } from "./type.js";

import { IOcrService } from "../services/Iocr.service.js";
import { IOcrRepository } from "../repositories/Iocr.repository.js";

import { OcrController } from "../controllers/ocr.controller.js";
import { OcrService } from "../services/ocr.service.js";
import { OcrRepository } from "../repositories/ocr.repository.js";
import { IOcrController } from "../controllers/Iocr.controller.js";
import { TesseractEngine } from "../services/tesseract.engine.js";
import { IOcrEngine } from "../services/IocrEngine.js";
import { AadhaarParser } from "../utils/aadhaar.parser.js";
import { OcrMapper } from "../utils/dto.mapper.js";


export const OcrModule = new ContainerModule(({bind})=>{
    bind<IOcrController>(TYPES.IOcrController).to(OcrController)
    bind<IOcrService>(TYPES.IOcrService).to(OcrService)
    bind<IOcrRepository>(TYPES.IOcrRepository).to(OcrRepository)
    bind<IOcrEngine>(TYPES.IOcrEngine).to(TesseractEngine)
    bind<AadhaarParser>(TYPES.AadhaarParser).to(AadhaarParser)
    bind<OcrMapper>(TYPES.OcrMapper).to(OcrMapper)
})