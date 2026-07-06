import { promises as fs } from "node:fs";
import path from "node:path";

import { isValidImageName } from "./validator.js";

function isSupportedImage(fileName) {
    const extension = path.extname(fileName).toLowerCase();

    return extension === ".jpg" || extension === ".jpeg";
}

async function collectImages(directoryPath, imagePaths) {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
            await collectImages(fullPath, imagePaths);
            continue;
        }

        if (
            entry.isFile() &&
            isSupportedImage(entry.name) &&
            isValidImageName(entry.name)
        ) {
            imagePaths.push(fullPath);
        }
    }
}

export async function scanImages(directoryPath) {
    const imagePaths = [];

    await collectImages(directoryPath, imagePaths);

    return imagePaths.sort((left, right) => left.localeCompare(right));
}
