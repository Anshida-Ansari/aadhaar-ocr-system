import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";

import { IOcrService } from "../services/Iocr.service.js";
import { TYPES } from "../inversify/type.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages.constants.js";
import { ERROR_CODES, SUCCESS_CODES } from "../constants/status.codes.constants.js";
import { IOcrController } from "./Iocr.controller.js";

@injectable()
export class OcrController implements IOcrController {
  constructor(
    @inject(TYPES.IOcrService)
    private readonly _ocrService: IOcrService
  ) {}

  processOcr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;
      const frontFile = files?.front?.[0];
      const backFile = files?.back?.[0];

      if (!frontFile || !backFile) {
        res.status(ERROR_CODES.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.BOTH_IMAGES_REQUIRED,
        });
        return;
      }

      const result = await this._ocrService.processAndSaveOcr(
        frontFile.buffer,
        backFile.buffer
      );

      res.status(SUCCESS_CODES.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.OCR_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}