import Collection from '@/classes/Collection'
import { get, set } from 'idb-keyval'

import usePermissions from '@/composables/permissions'

let handler: FileSystemDirectoryHandle;

let callback: Function;

export default function() {
    const { verifyPermission } = usePermissions();


    /**
     * Проверка, есть ли доступ к папке с Коллекциями.
     * @returns status.
     */
    async function checkMainFolderAccess() {
        const data: FileSystemDirectoryHandle | undefined = await get('entryHandle');
        if(data == undefined) return false;
        if(Array.isArray(data) && data.length == 0) return false;

        handler = data;

        return verifyPermission(data);
    }

    /**
     * Запрос папки с коллекциями.
     */
    async function requestMainFolderAccess() {
        try {
            handler = await window.showDirectoryPicker();
            await set('entryHandle', handler);
            if(callback) callback();
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Load file from provided file handle.
     * @param handle File handle for requested file.
     * @returns Requested file object.
     */
    async function loadFile(handle: FileSystemFileHandle) {
        const data = await handle.getFile();
        return data;
    }

    /**
     * Write file to the provided folder.
     * @param handle Folder handle.
     * @param name File name.
     * @param content File content.
     */
    async function writeFile(handle: FileSystemDirectoryHandle, name: string, content: FileSystemWriteChunkType) {
        try {
            const fileHandler = await handle.getFileHandle(name, {create: true});
            const stream = await fileHandler.createWritable();
            await stream.write(content);
            await stream.close();
            return fileHandler;
        } catch(err) {
            console.log(err);
            throw(err);
        }
    }

    /**
     * Initialize user collections.
     * @returns Array with user collections.
     */
    async function initLoadCollections() {
        const arr: Array<Collection> = [];

        if(handler != undefined) {
            for await (const [key, h] of handler.entries()) {
                if(h.kind == 'directory') {
                    arr.push(await Collection.fromFolderHandle(h));
                }
            }
        }

        return arr;
    }



    function getHandle() {
        return handler;
    }




    return {
        checkMainFolderAccess,
        requestMainFolderAccess,
        writeFile,
        loadFile,
        initLoadCollections,
        getHandle,
    }
}