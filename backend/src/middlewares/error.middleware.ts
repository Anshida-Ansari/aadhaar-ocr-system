import { Request, Response, NextFunction } from "express";
import { ERROR_CODES } from "../constants/status.codes.constants.js";
import { ERROR_MESSAGES } from "../constants/messages.constants.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode = err.status || ERROR_CODES.SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
  });
};
