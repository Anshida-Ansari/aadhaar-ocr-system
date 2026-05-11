export interface IOcrEngine {
  extractText(imageBuffer: Buffer): Promise<string>;
}