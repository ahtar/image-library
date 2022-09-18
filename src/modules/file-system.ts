import Collection from '@/classes/Collection';

let handle: FileSystemDirectoryHandle;

/**
 * Запрос папки с коллекциями.
 */
async function requestMainFolderAccess(): Promise<FileSystemDirectoryHandle> {
    handle = await window.showDirectoryPicker();
    return handle;
}

/**
 * Загрузка файла из полученного FileHandle.
 * @param handle FileHandle требуемого файла.
 * @returns Файл.
 */
async function loadFile(handle: FileSystemFileHandle): Promise<File> {
    const data = await handle.getFile();
    return data;
}

/**
 * Запись файла в предоставленную папку.
 * @param handle DirectoryHandle папки.
 * @param name Название файла.
 * @param content Содержимое файла.
 * @returns FileHandle созданного файла.
 */
async function writeFile(
    handle: FileSystemDirectoryHandle,
    name: string,
    content: FileSystemWriteChunkType
): Promise<FileSystemFileHandle> {
    try {
        const filehandle = await handle.getFileHandle(name, { create: true });
        const stream = await filehandle.createWritable();
        await stream.write(content);
        await stream.close();
        return filehandle;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Получение всех коллекций пользователя.
 * @returns Массив с коллекциями.
 */
async function initLoadCollections(): Promise<Collection[]> {
    const arr: Array<Collection> = [];

    if (handle != undefined) {
        for await (const [key, h] of handle.entries()) {
            key;
            if (h.kind == 'directory') {
                const collection = await Collection.fromFolderHandle(h);
                if (collection) arr.push(collection);
            }
        }
    }

    return arr;
}

/**
 * Получение DirectoryHandle папки приложения.
 * @returns DirectoryHandle папки приложения.
 */
function getHandle(): FileSystemDirectoryHandle {
    return handle;
}

export default {
    requestMainFolderAccess,
    writeFile,
    loadFile,
    initLoadCollections,
    getHandle,
};
