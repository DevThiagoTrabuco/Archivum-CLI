import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";
import path from "node:path";

import sharp from "sharp";

import { buildPdfFileName } from "../core/formatter.js";

export async function generatePdfForGroup(groupImages, outputDir, outputName) {
    const [firstImage] = groupImages;
    const pdfFileName = buildPdfFileName(outputName, path.basename(firstImage));

    if (!pdfFileName) {
        throw new Error(
            "Unable to determine the PDF name from the image group.",
        );
    }

    const pdfPath = path.join(outputDir, pdfFileName);
    const document = new PDFDocument({ autoFirstPage: false });
    const stream = createWriteStream(pdfPath);

    document.pipe(stream);

    for (const imagePath of groupImages) {
        const metadata = await sharp(imagePath).metadata();
        const density = metadata.density ?? 72;
        const width = ((metadata.width ?? 612) * 72) / density;
        const height = ((metadata.height ?? 792) * 72) / density;

        document.addPage({ size: [width, height] });
        document.image(imagePath, 0, 0, { width, height });
    }

    document.end();

    await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });

    return pdfPath;
}
