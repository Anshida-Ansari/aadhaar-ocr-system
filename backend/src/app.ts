import "reflect-metadata";

import express, {
  type Request,
  type Response,
} from "express";

import cors from "cors";
import dotenv from "dotenv";
import { initContainer } from "./inversify/inversify.di.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ROUTES } from "./constants/route.constants.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

await initContainer();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Aadhaar OCR API is running...");
});

const { default: router } = await import("./routes/ocr.routes.js");
app.use(`${ROUTES.API.BASE}${ROUTES.API.OCR.BASE}`, router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});