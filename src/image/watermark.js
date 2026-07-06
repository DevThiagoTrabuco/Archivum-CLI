import { promises as fs } from "node:fs";
import path from "node:path";

import sharp from "sharp";

export async function applyWatermarkToImage(
    inputPath,
    outputPath,
    watermarkPath,
) {
    const normalizedWatermarkPath = watermarkPath?.trim();

    if (normalizedWatermarkPath) {
        await sharp(inputPath)
            .composite([
                {
                    input: normalizedWatermarkPath,
                    gravity: "northeast",
                    blend: "over",
                },
            ])
            .toFile(outputPath);

        return outputPath;
    }

    const metadata = await sharp(inputPath).metadata();
    const width = metadata.width ?? 1200;
    const height = metadata.height ?? 800;
    const fontSize = Math.max(24, Math.floor(Math.min(width, height) / 10));
    const svg = `
    <svg width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="none" />
      <text x="${width / 2}" y="${height / 2}" font-size="${fontSize}" font-family="Arial" fill="rgba(255,255,255,0.28)" text-anchor="middle" dominant-baseline="middle">Archivum</text>
    </svg>
  `;

    await sharp(inputPath)
        .composite([{ input: Buffer.from(svg), gravity: "center" }])
        .toFile(outputPath);

    return outputPath;
}

export async function createWatermarkedCopy(
    inputPath,
    outputDir,
    watermarkPath,
) {
    await fs.mkdir(outputDir, { recursive: true });

    const fileName = path.basename(inputPath);
    const tempOutputPath = path.join(outputDir, fileName);

    await applyWatermarkToImage(inputPath, tempOutputPath, watermarkPath);

    return tempOutputPath;
}
