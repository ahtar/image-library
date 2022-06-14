

interface Window {
    showDirectoryPicker: FileSystemDirectoryReader
}

interface Collection {
    manifest: CollectionManifest,
    loaded: boolean,
    arr: Array<ImageSingle | ImageSet>,
    tags: Array<Tag>,
    thumbnail: FileSystemFileHandle,
    addImage(image: ImageSingle | ImageSet | Array<ImageSingle | ImageSet>): Promise<void>,
    createImage(manifest: ImageSingleData, image: Blob): Promise<Void>,
    createSet(images: Array<ImageSingle>): Promise<void>,
    deleteImage(image: ImageSingle | ImageSet): Promise<void>,
    updateImage(image: ImageSingle | ImageSet): Promise<void>,
    initLoadCollection(): Promise<void>,
    deleteCollection(): Promise<void>
}

interface CollectionManifest {
    name: string,
    description?: string,
    theme?: string,
    created: string,
    lastModified?: string,

}


interface ImageSingle {
    manifest: ImageSingleData,
    collectionHandle: FileSystemDirectoryHandle,
    imageHandle: FileSystemFileHandle | null,
    thumbnailHandle: FileSystemFileHandle | null,
    async loadImage(): Promise<void>,
    async loadThumbnail(): Promise<void>,
    async getImage(): Promise<FileSystemFileHandle>,
    async getThumbnail(): Promise<FileSystemFileHandle>,
}

interface ImageSet {
    manifest: ImageSetData,
    arr: Array<ImageSingle>
    removeImage(image: ImageSingle): void,
}


abstract interface ImageManifest {
    id: string,
    dateCreated: string,
    dateEdited?: string,
}

interface ImageSingleData extends ImageManifest {
    hash: string,
    tags: Array<string>,
    fileUrl: string,
    previewFileUrl: string,
    description?: string
}

interface ImageSetData extends ImageManifest {
    set: Array<ImageSingleData>
}


interface Tag {
    type?: TagGype,
    name: string,
    description?: string,
    count: number
}

interface TagGype {
    typeName: string,
    description?: string,
    colorCode?: string
}

declare module 'vue-virtual-scroll-list' {

}