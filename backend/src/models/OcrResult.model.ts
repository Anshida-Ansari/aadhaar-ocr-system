import mongoose, { Schema } from 'mongoose';
import { OcrResult } from '../types/ocr.result.js';

const ocrResultSchema: Schema = new Schema<OcrResult>({
  aadhaarNumber: String,
  name: String,
  dob: String,
  gender: String,
  pincode: String,
  address: String,
  frontImagePath: String,
  backImagePath: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<OcrResult>('OcrResult', ocrResultSchema);