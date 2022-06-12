

async function renderImage(image: HTMLImageElement, file: FileSystemFileHandle | string | Blob | undefined): Promise<string> {
    let data: string | null = null;

    if(file) {
        //file == string
        if(typeof file == 'string') {
            data = file;
        } else {
            if('getFile' in file) {
                //file == FileSystemFileHandle
                data = URL.createObjectURL(await file.getFile());
            } else {
                //file == Blob
                data = URL.createObjectURL(file);
            }
        }
    }

    return new Promise((resolve) => {
        const src = image.src;

        if(src != undefined) {
            URL.revokeObjectURL(src);
        }

        if(data) {
            //ожидание прогрузки изображения
            image.onload = function() {
                resolve(data!);
            };
            image.src = data;
        } else {
            image.src = '';
            resolve('');
        }
    });
}



export default function() {
    return {
        renderImage,
    }
}