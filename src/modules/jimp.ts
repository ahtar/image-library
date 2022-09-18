const Jimp = () => import(/* webpackChunkName: "jimp" */ 'jimp/es');

async function getHash(image: File): Promise<string> {
    if (/video\/\S*/g.test(image.type)) {
        const frame = await _getVideoFrame(image);
        const buffer = await frame.arrayBuffer();
        const jimpImage = await (await Jimp()).default.read(buffer);
        return jimpImage.hash();
    }
    const buffer = await image.arrayBuffer();
    const jimpImage = await (await Jimp()).default.read(buffer);
    return jimpImage.hash();
}

async function resize(
    data: Blob | File,
    max = { x: 160, y: 200 }
): Promise<File | Blob> {
    if ('name' in data) {
        //video
        if (/video\/\S*/g.test(data.type)) {
            const frame = await _getVideoFrame(data, 2);
            const image = await (
                await Jimp()
            ).default.read(await frame.arrayBuffer());

            if (image.bitmap.width > image.bitmap.height) {
                await image.resize(max.x, (await Jimp()).default.AUTO);
            } else {
                await image.resize((await Jimp()).default.AUTO, max.y);
            }

            const arrayBuffer = await image.getBufferAsync(image.getMIME());
            const blob = new Blob([(arrayBuffer as Uint8Array).buffer]);
            const file = new File([blob], data.name, {
                type: 'image/png',
            });

            return file;
        }
    }

    const image = await (await Jimp()).default.read(await data.arrayBuffer());
    if (image.bitmap.width > image.bitmap.height) {
        await image.resize(max.x, (await Jimp()).default.AUTO);
    } else {
        await image.resize((await Jimp()).default.AUTO, max.y);
    }

    //buffer to blob
    const tempData = await image.getBufferAsync(image.getMIME());
    return new Blob([(tempData as Uint8Array).buffer]);
}

/**
 * Получение кадра из предоставленного видео.
 * @param data Видео файл.
 * @param frameTimeInSeconds Время нужного кадра в секундах.
 * @returns файл с кадром.
 */
function _getVideoFrame(data: File, frameTimeInSeconds = 0.1): Promise<File> {
    return new Promise((resolve, reject) => {
        if (!/video\/\S*/g.test(data.type)) reject('File not a video.');

        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const source = document.createElement('source');
        const context = canvas.getContext('2d');
        const urlRef = URL.createObjectURL(data);

        video.style.display = 'none';
        canvas.style.display = 'none';

        source.setAttribute('src', urlRef);
        video.appendChild(source);
        document.body.appendChild(canvas);
        document.body.appendChild(video);

        if (!context) {
            URL.revokeObjectURL(urlRef);
            video.remove();
            canvas.remove();
            reject('context 2d undefined.');
            return;
        }

        video.currentTime = frameTimeInSeconds;
        video.load();

        video.addEventListener('loadedmetadata', function () {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

        video.addEventListener('loadeddata', function () {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            canvas.toBlob((blob) => {
                if (!blob) {
                    URL.revokeObjectURL(urlRef);
                    video.remove();
                    canvas.remove();
                    reject('_getVideoFrame: blob error');
                    return;
                }

                const file = new File([blob], data.name, {
                    type: 'image/png',
                });

                URL.revokeObjectURL(urlRef);
                video.remove();
                canvas.remove();

                resolve(file);
            });
        });
    });
}

export default {
    getHash,
    resize,
};
