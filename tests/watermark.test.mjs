import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

import { createWatermarkedCopy } from "../src/image/watermark.js";

test("creates a watermarked copy using a custom image watermark", async () => {
    const tmpDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "archivum-watermark-"),
    );
    const sourcePath = path.join(tmpDir, "source.jpg");
    const watermarkPath = path.join(tmpDir, "watermark.png");
    const outputDir = path.join(tmpDir, "output");

    await sharp({
        create: {
            width: 120,
            height: 120,
            channels: 3,
            background: { r: 255, g: 0, b: 0 },
        },
    })
        .jpeg()
        .toFile(sourcePath);

    await sharp({
        create: {
            width: 80,
            height: 40,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0.5 },
        },
    })
        .png()
        .toFile(watermarkPath);

    const outputPath = await createWatermarkedCopy(
        sourcePath,
        outputDir,
        watermarkPath,
    );

    const stats = await fs.stat(outputPath);
    assert.equal(stats.isFile(), true);
    assert.equal(path.basename(outputPath), "source.jpg");
});
