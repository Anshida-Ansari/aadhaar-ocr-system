
import { Request, Response, NextFunction } from "express"

export interface IOcrController{
     processOcr(req: Request, res: Response, next: NextFunction):Promise<void>;
}