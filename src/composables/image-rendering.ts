import crypto from "@/modules/crypto";

/**
 * Изменение src изображения.
 * @param image DOM элемент.
 * @param file src изображения.
 */
async function renderImage(
    image: HTMLImageElement,
    file: FileSystemFileHandle | string | Blob | undefined
) {

    if (typeof file == 'undefined') {
        image.src = "";
        return;
    }

    if (typeof file == 'string') {
        image.src = file;
        return;
    }

    if (file instanceof Blob) {
        image.src = URL.createObjectURL(file);
        return;
    }

    if (file.name.includes(".dpx") || file.name.includes(".tpx")) {
        const arrayBuffer = await (await file.getFile()).arrayBuffer();
        image.src = URL.createObjectURL(await crypto.recover(arrayBuffer));
        return;
    }

    image.src = URL.createObjectURL(await file.getFile());
}

function releaseImage(image: HTMLImageElement) {
    if (image.src != "") {
        URL.revokeObjectURL(image.src);
    }
}

export default function () {
    return {
        renderImage,
        releaseImage,
    };
}
