import { Router } from 'express';
import multer from 'multer';
import { TYPES } from '../inversify/type.js';
import { container } from '../inversify/inversify.di.js';
import { OcrController } from '../controllers/ocr.controller.js';
import { ROUTES } from '../constants/route.constants.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const ocrController = container.get<OcrController>(
  TYPES.IOcrController
)

router.post(
  ROUTES.API.OCR.PROCESS,
  upload.fields([{ name: 'front', maxCount: 1 },{ name: 'back', maxCount: 1 }]),
  ocrController.processOcr
);

export default router;
