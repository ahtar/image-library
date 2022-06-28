import ImageSingle from '@/classes/ImageSingle'
import ImageSet from '@/classes/ImageSet'

import jimp from '@/modules/jimp'

import Fs from '@/composables/file-system'


interface CollectionOptions {
    name: string,
    created?: string,
    description?: string,
    theme?: string,
    lastModified?: string,
    count?: number
}



class CollectionOjbect implements Collection {

    //Данные коллекции.
    manifest: CollectionManifest;
    //Массив с изобажениями.
    arr: (ImageSingle | ImageSet)[];
    //Массив с тегами.
    tags: Array<Tag>;
    //Массив с тегами последнего созданного изображения.
    lastTags: Array<Tag> = [];
    //DirectoryHandle папки с коллекцией.
    private handle: FileSystemDirectoryHandle;
    //FileHandle превью коллекции.
    thumbnail: FileSystemFileHandle;
    //Инициализирована ли коллекция.
    loaded = false;

    /**
     * Получить объект Коллекции через FileSystemDirectoryHandle.
     * @param handle FileSystemDirectoryHandle папки Коллекции.
     * @returns Объект Collection.
     */
    static async fromFolderHandle(handle: FileSystemDirectoryHandle) {
        try {
            const manifest = JSON.parse(await (await (await handle.getFileHandle('manifest.json')).getFile()).text());
            const thumbnail = await handle.getFileHandle('thumbnail.png');
            const collectionClass = new this(manifest, thumbnail, handle);
            return collectionClass;
        } catch(err) {
            console.info(err, `entry name: ${handle.name}`, `entry kind: ${handle.kind}`);
            return null;
        }
    }

    constructor(options: CollectionOptions, thumbnail: FileSystemFileHandle, handle: FileSystemDirectoryHandle) {
        this.manifest = {
            name: options.name,
            created: options.created || Date(),
            description: options.description,
            theme: options.theme,
            lastModified: options.lastModified
        };
        this.thumbnail = thumbnail;
        this.arr = [];
        this.tags = [];
        this.handle = handle;
    }

    /**
     * Инициализация Коллекции.
     * Загрузка всех изображений.
     */
    async initLoadCollection() {
        const imageDataFolderHandler = await this.handle.getDirectoryHandle('imageData');

        const buffer: Array<ImageSingle | ImageSet> = [];
        const promises: Promise<ImageSetData | ImageSingleData>[] = [];

        console.time();

        //Получение информации об каждом изображении.
        for await (const [key, h] of imageDataFolderHandler.entries()) {
            promises.push((async () => {
                const imageDataHandler = await imageDataFolderHandler.getFileHandle(key);
                const imageData: ImageSetData | ImageSingleData = JSON.parse(await (await imageDataHandler.getFile()).text());
                return(imageData);
            })());
        }

        const images = await Promise.all(promises);

        //Создание объекта изображения и его добавление в массив.
        for(const image of images) {
            if('set' in image) {
                const temp = new ImageSet(image);
                for(const singleImage of image.set) {
                    temp.addImage(new ImageSingle(singleImage, this.handle));
                    for(const tag of singleImage.tags) {
                        //legacy
                        if(typeof tag == 'object') {
                            this.addTag((tag as any).tagName)
                        } else {
                            this.addTag(tag);
                        }
                    }
                }
                buffer.push(temp);
            } else {
                const temp = new ImageSingle(image, this.handle);
                buffer.push(temp);
                for(const tag of image.tags) {
                    //legacy
                    if(typeof tag == 'object') {
                        this.addTag((tag as any).tagName)
                    } else {
                        this.addTag(tag);
                    }
                }
            }
        }

        this.addImage(buffer);
        console.timeEnd();
        this.loaded = true;

        this.tags.sort((a, b) => {
            if(a.count < b.count) return 1;
            if(a.count > b.count) return -1;
            return 0;
        });
    }

    /**
     * Добавление тега в Коллекцию.
     * @param tag Название тега.
     */
    addTag(tag: string) {
        const t = this.tags.find((t) => t.name == tag);

        if(t) {
            t.count++;
        } else {
            this.tags.push({
                name: tag,
                count: 1
            });
        }
    }

    /**
     * Получение тега в Коллекции.
     * Если такого тега нет, то получение пустой заготовки тега.
     * @param name Название тега.
     * @returns Объект тега.
     */
    getTag(name: string) {
        const t = this.tags.find((t) => t.name == name);

        if(t) {
            return t;
        } else {
            return {
                name: name,
                count: 0
            }
        }
    }

    /**
     * Добавление готового Изображения в коллекцию.
     * @param image Объект Изображения.
     */
    async addImage(image: ImageSingle | ImageSet | Array<ImageSingle | ImageSet>) {
        if(Array.isArray(image)) {
            this.arr.unshift(...image);
        } else {
            this.arr.unshift(image);
        }
    }

    /**
     * Создание нового Изображения и его добавление в Коллекцию.
     * @param manifest Метаданные Изображения.
     * @param image Blob с самим изображением.
     */
    async createImage(manifest: ImageSingleData, image: Blob) {
        const fs = Fs();
        const imageDataFolderHandle = await this.handle.getDirectoryHandle('imageData', { create: true });
        const imageFileFolderHandle = await this.handle.getDirectoryHandle('images', { create: true });
        const imageThumbnailFolderHandle = await this.handle.getDirectoryHandle('thumbnails', { create: true });

        await fs.writeFile(imageDataFolderHandle, manifest.id + '.json', JSON.stringify(manifest));
        const imageHandle = await fs.writeFile(imageFileFolderHandle, manifest.fileUrl, image);
        const thumbnailHandle = await fs.writeFile(imageThumbnailFolderHandle, manifest.previewFileUrl, await jimp.resize(image));

        const img = new ImageSingle(manifest, this.handle);
        this.addImage(img);

        for(const tag of manifest.tags) {
            this.addTag(tag);
        }

        return img;
    }

    /**
     * Создание нового сета Изображений и его добавление в Коллекцию.
     * @param images Массив с Изображениями.
     */
    async createSet(images: Array<ImageSingle | ImageSet>) {
        const fs = Fs();
        const imageDataFolderHandle = await this.handle.getDirectoryHandle('imageData');
        
        const manifest: ImageSetData = {
            set: [],
            dateCreated: Date(),
            id: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
        };

        for(const image of images) {
            if('arr' in image) {
                manifest.set.push(...image.manifest.set);
                await imageDataFolderHandle.removeEntry(image.manifest.id + '.json');
                this.removeImage(image);
            } else {
                manifest.set.push(image.manifest);
                await imageDataFolderHandle.removeEntry(image.manifest.id + '.json');
                this.removeImage(image);
            }
        }

        await fs.writeFile(imageDataFolderHandle, manifest.id + '.json', JSON.stringify(manifest));

        const image = new ImageSet(manifest, images.map((image) => {
            if('arr' in image) {
                return image.arr;
            } else {
                return image;
            }
        }).flat());
        this.addImage(image);

    }
 

    /**
     * Удаление Изображения из Коллекции.
     * Удаляет все данные связанные с данным Изображением.
     * @param image Объект Изображения.
     */
    async deleteImage(image: ImageSingle | ImageSet): Promise<void> {
        try {
            const fs = Fs();
            const imageDataFolderHandle = await this.handle.getDirectoryHandle('imageData', { create: true });
            const imageFileFolderHandle = await this.handle.getDirectoryHandle('images', { create: true });
            const imageThumbnailFolderHandle = await this.handle.getDirectoryHandle('thumbnails', { create: true });
            //let status = false;
            const promises: Promise<void>[] = [];

            if('arr' in image) {
                for(const imageSingle of image.arr) {
                    promises.push(imageFileFolderHandle.removeEntry(imageSingle.manifest.fileUrl));
                    promises.push(imageThumbnailFolderHandle.removeEntry(imageSingle.manifest.previewFileUrl));
                }
                promises.push(imageDataFolderHandle.removeEntry(image.manifest.id + '.json'));
            } else {
                promises.push(imageDataFolderHandle.removeEntry(image.manifest.id + '.json'));
                promises.push(imageFileFolderHandle.removeEntry(image.manifest.fileUrl));
                promises.push(imageThumbnailFolderHandle.removeEntry(image.manifest.previewFileUrl));
            }

            const temp = await Promise.allSettled(promises);
            this.removeImage(image);
            console.info('File deleted?', temp);
        } catch(err) {
            console.log(err);
            throw(err);
        }
    }

    /**
     * Убирание Изображения из Коллекции без удаления данных этого Изображения.
     * При следующем запуске Изображение снова окажется в Коллекции.
     * @param image Объект Изображения.
     */
    removeImage(image: ImageSingle | ImageSet | ImageSingleData | string) {
        if(typeof image == 'string') {
            const index = this.arr.findIndex((i) => i.manifest.id == image);
            if(index != -1) this.arr.splice(index, 1);
        } else if('imageHandle' in image) {
            const index = this.arr.findIndex((i) => i.manifest.id == image.manifest.id);
            if(index != -1) this.arr.splice(index, 1);
        } else if('arr' in image) {
            const index = this.arr.findIndex((i) => i.manifest.id == image.manifest.id);
            if(index != -1) this.arr.splice(index, 1);
        } else {
            const index = this.arr.findIndex((i) => i.manifest.id == image.id);
            if(index != -1) this.arr.splice(index, 1);
        }
    }


    /**
     * Обновление Изображения в Коллекции.
     * @param image Объект Изображения.
     */
    async updateImage(image: ImageSingle | ImageSet): Promise<void> {
        const fs = Fs();
        const manifestFolderHandle = await this.handle.getDirectoryHandle('imageData');
        await fs.writeFile(manifestFolderHandle, image.manifest.id + '.json', JSON.stringify(image.manifest));
    }

    log() {
        console.log(this);
    }

    /**
     * Удаление коллекции.
     */
    async deleteCollection() {
        const handle = Fs().getHandle();
        await handle.removeEntry(this.manifest.name, { recursive: true });
    }

    /**
     * Обновление данных коллекции.
     * @param manifest данные коллекции.
     * @param thumbnail опциональный thumbnail файл.
     */
    async updateCollectionManifest(manifest: CollectionManifest, thumbnail?: Blob) {
        Fs().writeFile(this.handle, 'manifest.json', JSON.stringify(manifest));
        this.manifest = manifest;

        if(thumbnail) {
            const handle = await Fs().writeFile(this.handle, 'thumbnail.png', await jimp.resize(thumbnail));
            this.thumbnail = handle;
        }
    }
}



export default CollectionOjbect;