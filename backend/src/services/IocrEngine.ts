export interface IOcrEngine {
  init(): Promise<void>;
  extractText(imageBuffer: Buffer): Promise<string>;
}