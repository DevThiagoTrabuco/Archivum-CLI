const IMAGE_NAME_PATTERN =
    /^(?<day>\d{2})(?<month>\d{2})(?<year>\d{4})(?:(?<sequence>\d{2})|(?:\s*\(\s*(?<sequenceInParens>\d{1,2})\s*\))|(?:\s+(?<sequenceWithSpace>\d{1,2})))\.(?<extension>jpe?g)$/i;

function extractDateParts(fileName) {
    const match = fileName.match(IMAGE_NAME_PATTERN);

    if (!match?.groups) {
        return null;
    }

    const sequence =
        match.groups.sequence ??
        match.groups.sequenceInParens ??
        match.groups.sequenceWithSpace;

    return {
        day: match.groups.day,
        month: match.groups.month,
        year: match.groups.year,
        sequence: String(Number(sequence)).padStart(2, "0"),
    };
}

export function isValidImageName(fileName) {
    if (typeof fileName !== "string") {
        return false;
    }

    const parsedDate = extractDateParts(fileName);

    if (!parsedDate) {
        return false;
    }

    const date = new Date(
        Number(parsedDate.year),
        Number(parsedDate.month) - 1,
        Number(parsedDate.day),
    );

    return (
        date.getFullYear() === Number(parsedDate.year) &&
        date.getMonth() === Number(parsedDate.month) - 1 &&
        date.getDate() === Number(parsedDate.day)
    );
}

export function parseImageName(fileName) {
    const parsedDate = extractDateParts(fileName);

    if (!parsedDate) {
        return null;
    }

    return {
        day: parsedDate.day,
        month: parsedDate.month,
        year: parsedDate.year,
        sequence: parsedDate.sequence,
    };
}
