import test from "node:test";
import assert from "node:assert/strict";

import { isValidImageName, parseImageName } from "../src/core/validator.js";
import { formatDateForPdf, buildPdfFileName } from "../src/core/formatter.js";
import { groupImagesByDate } from "../src/core/grouper.js";

test("validates filenames in the expected format", () => {
    assert.equal(isValidImageName("0112194101.jpg"), true);
    assert.equal(isValidImageName("3112202410.jpeg"), true);
    assert.equal(isValidImageName("01052004 (1).jpg"), true);
    assert.equal(isValidImageName("0112194101.jpg.bak"), false);
    assert.equal(isValidImageName("invalid-name.jpg"), false);
});

test("parses date and sequence from a valid filename", () => {
    assert.deepEqual(parseImageName("0112194101.jpg"), {
        day: "01",
        month: "12",
        year: "1941",
        sequence: "01",
    });

    assert.deepEqual(parseImageName("01052004 (1).jpg"), {
        day: "01",
        month: "05",
        year: "2004",
        sequence: "01",
    });
});

test("builds the expected PDF name from a filename", () => {
    assert.equal(
        buildPdfFileName("0112194101.jpg"),
        "01 de Dezembro de 1941.pdf",
    );
    assert.equal(formatDateForPdf("0112194101.jpg"), "01 de Dezembro de 1941");
});

test("groups image paths by date", () => {
    const groups = groupImagesByDate([
        "/tmp/0112194101.jpg",
        "/tmp/0112194102.jpg",
        "/tmp/0212194103.jpg",
    ]);

    assert.deepEqual(groups, {
        "1941-12-01": ["/tmp/0112194101.jpg", "/tmp/0112194102.jpg"],
        "1941-12-02": ["/tmp/0212194103.jpg"],
    });
});
