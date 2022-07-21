interface Options {
    id: string;
    hash: string;
    tags: string[];
    fileUrl: string;
    previewFileUrl: string;
    dateEdited?: string | undefined;
    dateCreated: string;
    description?: string | undefined;
    corrupted?: boolean;
}

import memento from "@/modules/memento";

class ImageSingleObject implements ImageSingle {
    manifest: ImageSingleData;
    imageHandle: FileSystemFileHandle | null = null;
    thumbnailHandle: FileSystemFileHandle | null = null;
    collectionHandle: FileSystemDirectoryHandle;

    constructor(options: Options, handle: FileSystemDirectoryHandle) {
        this.manifest = {
            id: options.id,
            hash: options.hash,
            tags: options.tags,
            fileUrl: options.fileUrl,
            previewFileUrl: options.previewFileUrl,
            dateCreated: options.dateCreated,
            description: options.description,
            dateEdited: options.dateEdited,
            corrupted: options.corrupted,
        };
        this.collectionHandle = handle;
    }

    /**
     * Инициализация FileHandle на файл изображения из DirectoryHandle коллекции.
     */
    async loadImage(): Promise<void> {
        const folderHandle = await this.collectionHandle.getDirectoryHandle(
            "images"
        );
        this.imageHandle = await folderHandle.getFileHandle(this.manifest.fileUrl);
    }

    /**
     * Инициализация FileHandle на превью из DirectoryHandle коллекции.
     */
    async loadThumbnail(): Promise<void> {
        const folderHandle = await this.collectionHandle.getDirectoryHandle(
            "thumbnails"
        );
        this.thumbnailHandle = await folderHandle.getFileHandle(
            this.manifest.previewFileUrl
        );
    }

    /**
     * Получение файла изображения.
     * @returns FileHandle на файл изображения.
     */
    async getImage(): Promise<FileSystemFileHandle> {
        if (this.imageHandle == null) await this.loadImage();
        return this.imageHandle!;
    }

    /**
     * Получение превью изображения.
     * @returns FileHandle на превью.
     */
    async getThumbnail(): Promise<FileSystemFileHandle> {
        if (this.thumbnailHandle == null) await this.loadThumbnail();
        return this.thumbnailHandle!;
    }

    saveState() {
        memento.save(this.manifest, this.manifest.id);
    }

    restoreState() {
        const restoredData = memento.restore<ImageSingleData>(this.manifest.id);
        if (restoredData) this.manifest = restoredData;
        else console.log("restoreState: Error");
    }

    checkChanges() {
        const restoredStringData = memento.getString(this.manifest.id);
        const stringData = JSON.stringify(this.manifest);

        if (restoredStringData == stringData) return false;
        else return true;
    }
}

export default ImageSingleObject;
