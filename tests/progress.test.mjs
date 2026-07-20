import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

import { createProgressBar } from "../src/utils/progress.js";

test("createProgressBar returns a progress bar with the correct total groups", async () => {
    const tmpDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "archivum-progress-"),
    );
    const fileA = path.join(tmpDir, "0112194101.jpg");
    const fileB = path.join(tmpDir, "0112194102.jpg");
    const fileC = path.join(tmpDir, "0212194103.jpg");

    const image = {
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: 255, g: 255, b: 255 },
        },
    };

    await sharp(image).jpeg().toFile(fileA);
    await sharp(image).jpeg().toFile(fileB);
    await sharp(image).jpeg().toFile(fileC);

    const progressBar = await createProgressBar(tmpDir);

    assert.equal(progressBar.total, 2);
    assert.equal(progressBar.curr, 0);
    assert.equal(progressBar.width, 40);
});
