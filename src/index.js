#!/usr/bin/env node

import path from "node:path";

import {
    askForDirectory,
    askForWatermarkPath,
    askForOutputName,
} from "./cli/prompt.js";
import { archiveImages } from "./core/archive.js";

async function main() {
    try {
        const inputDirectory = await askForDirectory();
        const watermarkPath = await askForWatermarkPath();
        const outputName = await askForOutputName();
        const outputDirectory = path.join(inputDirectory, "pdfs");
        const generatedPdfs = await archiveImages(
            inputDirectory,
            outputDirectory,
            outputName,
            watermarkPath || undefined,
        );

        console.log(
            `Processamento concluído. ${generatedPdfs.length} PDF(s) gerado(s).`,
        );
    } catch (error) {
        console.error("Erro ao processar as imagens:", error.message);
        process.exitCode = 1;
    }
}

main();
