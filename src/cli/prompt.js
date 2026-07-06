import { input } from "@inquirer/prompts";

export async function askForDirectory() {
    return input({
        message: "Informe o diretório contendo as imagens:",
        validate: (value) =>
            value.trim().length > 0 || "O diretório é obrigatório.",
    });
}

export async function askForWatermarkPath() {
    return input({
        message: "Informe o caminho da imagem de marca d’água (opcional):",
        default: "",
    });
}

export async function askForOutputName() {
    return input({
        message: "Informe o título do arquivo de saída (opcional):",
        default: "",
    })
}
