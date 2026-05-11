import { File } from "multer";

declare global {
  namespace Express {
    interface Request {
      files?: {
        front?: File[];
        back?: File[];
      };
    }
  }
}