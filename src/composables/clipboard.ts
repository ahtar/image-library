import crypto from '@/modules/crypto';
/**
 * Копирование изображения в буфер обмена.
 * @param data Объект изображения.
 */
async function copyToClipboard(data: ImageSingle | ImageSet): Promise<void> {
    if ('arr' in data && data.arr[0].manifest.corrupted) {
        const blob = await (
            await (await data.arr[0].getImage()).getFile()
        ).arrayBuffer();
        const newBlob = await crypto.recover(blob);
        const file = new File([newBlob], data.arr[0].manifest.id + '.png', {
            type: 'image/png',
        });
        const item = new ClipboardItem({ [file.type]: file });
        await navigator.clipboard.write([item]);
        return;
    }

    if ('arr' in data) {
        const file = await (await data.arr[0].getImage()).getFile();
        const item = new ClipboardItem({ [file.type]: file });
        await navigator.clipboard.write([item]);
        return;
    }

    if (data.manifest.corrupted) {
        const blob = await (
            await (await data.getImage()).getFile()
        ).arrayBuffer();
        const newBlob = await crypto.recover(blob);
        const file = new File([newBlob], data.manifest.id + '.png', {
            type: 'image/png',
        });
        const item = new ClipboardItem({ [file.type]: file });
        await navigator.clipboard.write([item]);
        return;
    }

    const file = await (await data.getImage()).getFile();
    const item = new ClipboardItem({ [file.type]: file });
    await navigator.clipboard.write([item]);
}

/**
 * Чтение данных из буфера обмена.
 * @returns Данные из обмена обмена.
 */
async function readFromClipboard(): Promise<DataTransfer> {
    const data = await navigator.clipboard.read();
    return data;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    return {
        copyToClipboard,
        readFromClipboard,
    };
}
