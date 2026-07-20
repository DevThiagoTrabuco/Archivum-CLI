import Progress from "progress";
import { groupImagesByDate } from "../core/grouper.js";
import { scanImages } from "../core/scanner.js";

async function countImageGroups(inputDirectory) {
    const imagePaths = await scanImages(inputDirectory);
    const groupedImages = groupImagesByDate(imagePaths);

    return Object.keys(groupedImages).length;
}

export async function createProgressBar(inputDirectory) {
    const totalGroups = await countImageGroups(inputDirectory);

    return new Progress(
        "Processando grupos [:bar] :current/:total (:percent) :group",
        {
            total: totalGroups,
            width: 40,
            complete: "#",
            incomplete: "-",
            renderThrottle: 100,
        },
    );
}
