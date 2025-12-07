import vision from "@google-cloud/vision";
import sharp from "sharp";
import { BadRequestException } from "../exceptions/bad-request-exception";

const client = new vision.ImageAnnotatorClient();

export async function extractTextFromImage(file: Express.Multer.File) {
  try {
    file.buffer = await preprocessBuffer(file.buffer);
  } catch (err: any) {
    console.warn(`Preprocess failed for ${file.originalname}:`, err.message);
  }

  const [result] = await client.documentTextDetection({
    image: { content: file.buffer },
    imageContext: { languageHints: ["pt"] },
  });

  const fullTextAnnotation = result.fullTextAnnotation || {};
  const extractedText = fullTextAnnotation.text;

  if (!extractedText || extractedText.trim() === "") {
    throw new BadRequestException("The provided image does not have any text.");
  }

  return extractedText;
}

async function preprocessBuffer(buffer: Buffer) {
  return sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .grayscale()
    .normalize()
    .toBuffer();
}
