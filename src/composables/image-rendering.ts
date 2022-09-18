import crypto from '@/modules/crypto';

/**
 * Изменение src изображения.
 * @param image DOM элемент.
 * @param file src изображения.
 */
async function renderImage(
    image: HTMLImageElement | undefined,
    file: FileSystemFileHandle | string | Blob | File | undefined
) {
    if (typeof image == 'undefined' || image === null) {
        return;
    }

    if (typeof file == 'undefined') {
        if (image.src) image.src = '';
        return;
    }

    //string
    if (typeof file == 'string') {
        image.src = file;
        return;
    }

    //File
    if ('lastModified' in file) {
        if (file.name.includes('.dpx') || file.name.includes('.tpx')) {
            const arrayBuffer = await file.arrayBuffer();
            image.src = URL.createObjectURL(await crypto.recover(arrayBuffer));
            return;
        }
        image.src = URL.createObjectURL(file);
        return;
    }

    //blob
    if (file instanceof Blob) {
        image.src = URL.createObjectURL(file);
        return;
    }

    //FileSystemFileHandle
    if (file.name.includes('.dpx') || file.name.includes('.tpx')) {
        const arrayBuffer = await (await file.getFile()).arrayBuffer();
        image.src = URL.createObjectURL(await crypto.recover(arrayBuffer));
        return;
    }

    image.src = URL.createObjectURL(await file.getFile());
}

function releaseImage(image: HTMLImageElement) {
    if (image.src != '') {
        URL.revokeObjectURL(image.src);
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    return {
        renderImage,
        releaseImage,
    };
}
