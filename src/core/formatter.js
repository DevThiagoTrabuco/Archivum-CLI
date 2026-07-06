import { parseImageName } from "./validator.js";

const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

export function formatDateForPdf(outputName, value) {
    const parsed =
        typeof value === "string"
            ? parseImageName(value)
            : typeof outputName === "string"
              ? parseImageName(outputName)
              : outputName;

    if (!parsed) {
        return null;
    }

    const monthName = MONTHS[Number(parsed.month) - 1];
    const shouldUseOutputName =
        typeof outputName === "string" &&
        outputName.trim() &&
        typeof value === "string" &&
        !outputName.includes(".");
    const prefix = shouldUseOutputName ? `${outputName.trim()} ` : "";

    return `${prefix}${parsed.day} de ${monthName} de ${parsed.year}`;
}

export function buildPdfFileName(outputName, value) {
    const formattedDate = formatDateForPdf(outputName, value);

    if (!formattedDate) {
        return null;
    }

    return `${formattedDate}.pdf`;
}
