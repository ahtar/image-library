type FileSystemDirectoryHandle =
    import('@types/wicg-file-system-access').FileSystemDirectoryHandle;

interface Window {
    showDirectoryPicker: FileSystemDirectoryReader;
}

interface ImageUpdateData {
    manifest?: boolean;
    imageData?: {
        [key: string]: Blob;
    };
    separate?: ImageSingle[];
    corrupt?: boolean;
}

interface Collection {
    manifest: CollectionManifest;
    loaded: boolean;
    arr: Array<ImageSingle | ImageSet>;
    lastTags: Array<Tag>;
    tags: Array<Tag>;
    thumbnail: FileSystemFileHandle;
    addImage(
        image: ImageSingle | ImageSet | Array<ImageSingle | ImageSet>
    ): Promise<void>;
    createImage(manifest: ImageSingleData, image: Blob): Promise<Void>;
    createSet(images: Array<ImageSingle>): Promise<void>;
    deleteImage(image: ImageSingle | ImageSet): Promise<void>;
    updateImage(
        image: ImageSingle | ImageSet,
        data?: ImageUpdateData
    ): Promise<void>;
    addTag(tag: string): void;
    getTag(name: string): Tag;
    initLoadCollection(): Promise<void>;
    deleteCollection(): Promise<void>;
    updateCollectionManifest(
        manifest: CollectionManifest,
        thumbnail?: Blob
    ): Promise<void>;
}

interface CollectionOptions {
    name: string;
    created?: string;
    description?: string;
    theme?: string;
    lastModified?: string;
    count?: number;
    options?: {
        corrupted?: boolean;
    };
}

interface CollectionManifest {
    name: string;
    description?: string;
    theme?: string;
    created: string;
    lastModified?: string;
    options?: {
        corrupted?: boolean;
    };
}

interface ImageSingle {
    manifest: ImageSingleData;
    collectionHandle: FileSystemDirectoryHandle;
    imageHandle: FileSystemFileHandle | null;
    thumbnailHandle: FileSystemFileHandle | null;
    loadImage(): Promise<FileSystemFileHandle>;
    loadThumbnail(): Promise<FileSystemFileHandle>;
    getImage(): Promise<FileSystemFileHandle>;
    getThumbnail(): Promise<FileSystemFileHandle>;
    saveState(): void;
    restoreState(): void;
    checkChanges(): boolean;
    getUrl(): {
        file: string;
        thumbnail: string;
    };
}

interface ImageSet {
    manifest: ImageSetData;
    arr: Array<ImageSingle>;
    removeImage(image: ImageSingle): void;
    saveState(): void;
    restoreState(): void;
    checkChanges(): boolean;
}

abstract interface ImageManifest {
    id: string;
    dateCreated: string;
    dateEdited?: string;
}

interface ImageSingleData extends ImageManifest {
    hash: string;
    tags: Array<string>;
    //MIME type файла.
    type: string;
    description?: string;
    corrupted?: boolean;
}

type ImageSetData = ImageManifest;

interface ImageSetSavedData extends ImageSetData {
    set: Array<ImageSingleData>;
}

interface ImageSetRestoredData {
    manifest: ImageSetData;
    arrOrder: Array[string];
}

interface Tag {
    type?: TagType;
    name: string;
    description?: string;
    count: number;
}

interface TagType {
    typeName: string;
    description?: string;
    colorCode?: string;
}

interface NotificationMessage {
    message: string;
    status: boolean;
    id: number;
}

type ContextMenuItem = Collection | ImageSingle | ImageSet;
