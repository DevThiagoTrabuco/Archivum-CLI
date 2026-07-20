import { promises as fs } from "node:fs";
import path from "node:path";

import { scanImages } from "./scanner.js";
import { groupImagesByDate } from "./grouper.js";
import { parseImageName } from "./validator.js";
import { createWatermarkedCopy } from "../image/watermark.js";
import { generatePdfForGroup } from "../pdf/generator.js";

function buildGroupLabel(imagePath, outputName) {
    const fileName = path.basename(imagePath);
    const parsed = parseImageName(fileName);
    const fallbackLabel = `${fileName}`;

    if (!parsed) {
        return fallbackLabel;
    }

    const dateLabel = `${parsed.day}/${parsed.month}/${parsed.year}`;
    const prefix =
        outputName && outputName.trim() ? `${outputName.trim()} ` : "";
    const label = `${prefix}${dateLabel}`;

    return label.length > 30 ? `${label.slice(0, 27)}...` : label;
}

export async function archiveImages(
    inputDirectory,
    outputDirectory,
    outputName,
    watermarkPath,
    progressBar,
) {
    const imagePaths = await scanImages(inputDirectory);

    if (imagePaths.length === 0) {
        return [];
    }

    await fs.mkdir(outputDirectory, { recursive: true });

    const groupedImages = groupImagesByDate(imagePaths);
    const generatedPdfs = [];

    for (const groupImages of Object.values(groupedImages)) {
        const tempDir = path.join(outputDirectory, ".tmp");
        const watermarkedCopies = [];

        for (const imagePath of groupImages) {
            const copiedImage = await createWatermarkedCopy(
                imagePath,
                tempDir,
                watermarkPath,
            );
            watermarkedCopies.push(copiedImage);
        }

        const generatedPdf = await generatePdfForGroup(
            watermarkedCopies,
            outputDirectory,
            outputName,
        );
        generatedPdfs.push(generatedPdf);

        if (progressBar) {
            const currentGroup = buildGroupLabel(groupImages[0], outputName);
            progressBar.tick({ group: currentGroup });
        }

        await fs.rm(tempDir, { recursive: true, force: true }).catch((err) => {
            console.error(`Não foi possível remover o diretório temporário.`);
            console.error(err);
        });
    }

    return generatedPdfs;
}
