

async function renderImage(image: HTMLImageElement, file: FileSystemFileHandle | string) {
    let data: string | null = null;

    if(typeof file == 'string') {
        data = file;
    } else {
        data = URL.createObjectURL(await file.getFile());
    }

    return new Promise((resolve) => {
        const src = image.src;

        if(src != undefined) {
            URL.revokeObjectURL(src);
        }

        if(data) {
            image.onload = function() {
                resolve(null);
            };
            image.src = data;
        } else {
            resolve(null);
        }
    });
}



export default function() {
    return {
        renderImage,
    }
}