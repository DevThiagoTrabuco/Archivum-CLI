#!/usr/bin/env node

import path from "node:path";

import {
    askForDirectory,
    askForWatermarkPath,
    askForOutputName,
} from "./cli/prompt.js";
import { archiveImages } from "./core/archive.js";
import { createProgressBar } from "./utils/progress.js";

async function main() {
    try {
        const inputDirectory = await askForDirectory();
        const watermarkPath = await askForWatermarkPath();
        const outputName = await askForOutputName();
        const outputDirectory = path.join(inputDirectory, "pdfs");
        const progressBar = await createProgressBar(inputDirectory);
        const generatedPdfs = await archiveImages(
            inputDirectory,
            outputDirectory,
            outputName,
            watermarkPath || undefined,
            progressBar,
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
