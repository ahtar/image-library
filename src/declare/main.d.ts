

interface Window {
    showDirectoryPicker: FileSystemDirectoryReader
}

interface ImageUpdateData {
    manifest?: ImageSingleData | ImageSetData,
    imageData?: {
        [key: string]: Blob
    },
    separate?: ImageSingle[]
}

interface Collection {
    manifest: CollectionManifest,
    loaded: boolean,
    arr: Array<ImageSingle | ImageSet>,
    lastTags: Array<Tag>,
    tags: Array<Tag>,
    thumbnail: FileSystemFileHandle,
    addImage(image: ImageSingle | ImageSet | Array<ImageSingle | ImageSet>): Promise<void>,
    createImage(manifest: ImageSingleData, image: Blob): Promise<Void>,
    createSet(images: Array<ImageSingle>): Promise<void>,
    deleteImage(image: ImageSingle | ImageSet): Promise<void>,
    updateImage(image: ImageSingle | ImageSet, data?: ImageUpdateData): Promise<void>,
    addTag(tag: string): void,
    getTag(name: string): Tag,
    initLoadCollection(): Promise<void>,
    deleteCollection(): Promise<void>,
    updateCollectionManifest(manifest: CollectionManifest, thumbnail?: Blob): Promise<void>
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
    async getThumbnail(): Promise<FileSystemFileHandle>
    saveState(): void,
    restoreState(): void,
    checkChanges(): boolean
}

interface ImageSet {
    manifest: ImageSetData,
    arr: Array<ImageSingle>
    removeImage(image: ImageSingle): void,
    saveState(): void,
    restoreState(): void,
    checkChanges(): boolean
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

}

interface ImageSetSavedData extends ImageSetData {
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