interface Options {
    id: string;
    hash: string;
    tags: string[];
    fileUrl: string;
    previewFileUrl: string;
    dateEdited?: string | undefined;
    dateCreated: string;
    description?: string | undefined;
}


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
            dateEdited: options.dateEdited
        }; 
        this.collectionHandle = handle;
    }

    async loadImage(): Promise<void> {
        const folderHandle = await this.collectionHandle.getDirectoryHandle('images');
        this.imageHandle = await folderHandle.getFileHandle(this.manifest.fileUrl);
    }

    async loadThumbnail(): Promise<void> {
        const folderHandle = await this.collectionHandle.getDirectoryHandle('thumbnails');
        this.thumbnailHandle = await folderHandle.getFileHandle(this.manifest.previewFileUrl);
    }

    async getImage(): Promise<FileSystemFileHandle> {
        if(this.imageHandle == null) await this.loadImage();
        return this.imageHandle!;
    }

    async getThumbnail(): Promise<FileSystemFileHandle> {
        if(this.thumbnailHandle == null) await this.loadThumbnail();
        return this.thumbnailHandle!;
    }
}




export default ImageSingleObject;