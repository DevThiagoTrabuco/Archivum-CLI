import path from "node:path";

import { parseImageName } from "./validator.js";

export function groupImagesByDate(imagePaths) {
    const groups = new Map();

    for (const imagePath of imagePaths) {
        const fileName = path.basename(imagePath);
        const parsedImage = parseImageName(fileName);

        if (!parsedImage) {
            continue;
        }

        const groupKey = `${parsedImage.year}-${parsedImage.month}-${parsedImage.day}`;
        const existingGroup = groups.get(groupKey) ?? [];

        existingGroup.push(imagePath);
        groups.set(groupKey, existingGroup);
    }

    return Object.fromEntries(
        [...groups.entries()].sort(([leftKey], [rightKey]) =>
            leftKey.localeCompare(rightKey),
        ),
    );
}
