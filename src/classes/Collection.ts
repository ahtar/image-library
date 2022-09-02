import ImageSingle from "@/classes/ImageSingle";
import ImageSet from "@/classes/ImageSet";

import jimp from "@/modules/jimp";
import crypto from "@/modules/crypto";

import fs from "@/modules/file-system";

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
     * Получение экземпляра коллекции через FileSystemDirectoryHandle.
     * @param handle FileSystemDirectoryHandle папки Коллекции.
     * @returns Объект Collection.
     */
    static async fromFolderHandle(handle: FileSystemDirectoryHandle) {
        try {
            const manifest = JSON.parse(
                await (
                    await (await handle.getFileHandle("manifest.json")).getFile()
                ).text()
            );
            const thumbnail = await handle.getFileHandle("thumbnail.png");
            const collectionClass = new this(manifest, thumbnail, handle);
            return collectionClass;
        } catch (err) {
            console.info(
                err,
                `entry name: ${handle.name}`,
                `entry kind: ${handle.kind}`
            );
            return null;
        }
    }

    /**
     * @param options Параметры коллекции.
     * @param thumbnail FileHandle на превью коллекции.
     * @param handle DirectoryHandle на папку коллекции.
     */
    constructor(
        options: CollectionOptions,
        thumbnail: FileSystemFileHandle,
        handle: FileSystemDirectoryHandle
    ) {
        this.manifest = {
            name: options.name,
            created: options.created || Date(),
            description: options.description,
            theme: options.theme,
            lastModified: options.lastModified,
            options: {
                corrupted: options.options?.corrupted || false,
            },
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
        const imageDataFolderHandler = await this.handle.getDirectoryHandle(
            "imageData"
        );

        const buffer: Array<ImageSingle | ImageSet> = [];
        const promises: Promise<ImageSetSavedData | ImageSingleData>[] = [];

        console.time();

        //Получение информации об каждом изображении.
        for await (const [key, h] of imageDataFolderHandler.entries()) {
            promises.push(
                (async () => {
                    const imageDataHandler = await imageDataFolderHandler.getFileHandle(
                        key
                    );
                    const imageData = JSON.parse(
                        await (await imageDataHandler.getFile()).text()
                    ) as ImageSetSavedData | ImageSingleData;
                    return imageData;
                })()
            );
        }

        const images = await Promise.all(promises);

        //Создание объекта изображения и его добавление в массив.
        for (const image of images) {
            if ("set" in image) {
                const temp = new ImageSet(image);
                for (const singleImage of image.set) {
                    temp.addImage(new ImageSingle(singleImage, this.handle));

                    //теги
                    for (const tag of singleImage.tags) {
                        //legacy
                        if (typeof tag == "object") {
                            this.addTag((tag as any).tagName);
                        } else {
                            this.addTag(tag);
                        }
                    }
                }
                buffer.push(temp);
            } else {
                const temp = new ImageSingle(image, this.handle);
                buffer.push(temp);

                //теги
                for (const tag of image.tags) {
                    //legacy
                    if (typeof tag == "object") {
                        this.addTag((tag as any).tagName);
                    } else {
                        this.addTag(tag);
                    }
                }
            }
        }

        //Первоначальная сортировка тегов по убыванию.
        this.tags.sort((a, b) => {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return 0;
        });

        this.addImage(buffer);
        //Первоначальная сортирвока изображений.
        this.arr.sort((a, b) => {
            const dateA = new Date(a.manifest.dateCreated);
            const dateB = new Date(b.manifest.dateCreated);
            if(dateA < dateB) return 1;
            if(dateA > dateB) return -1;
            return 0;
        });
        console.timeEnd();
        this.loaded = true;
    }

    /**
     * Добавление тега в Коллекцию. Если такой тег уже есть, то увеличение счетчика тега.
     * @param tag Название тега.
     */
    addTag(tag: string) {
        const t = this.tags.find((t) => t.name == tag);

        if (t) {
            t.count++;
        } else {
            this.tags.push({
                name: tag,
                count: 1,
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

        if (t) {
            return t;
        } else {
            return {
                name: name,
                count: 0,
            };
        }
    }

    /**
     * Добавление готового Изображения в коллекцию.
     * @param image Объект Изображения.
     */
    async addImage(
        image: ImageSingle | ImageSet | Array<ImageSingle | ImageSet>
    ) {
        if (Array.isArray(image)) {
            this.arr.unshift(...image);
        } else {
            this.arr.unshift(image);
        }
    }

    /**
     * Создание нового Изображения и его добавление в Коллекцию.
     * @param manifest данные Изображения.
     * @param image Blob с изображением.
     */
    async createImage(manifest: ImageSingleData, image: File) {
        const img = new ImageSingle(manifest, this.handle);

        console.info('Collection:createImage: ', manifest, image);
        const imageDataFolderHandle = await this.handle.getDirectoryHandle(
            "imageData",
            { create: true }
        );
        const imageFileFolderHandle = await this.handle.getDirectoryHandle(
            "images",
            { create: true }
        );
        const imageThumbnailFolderHandle = await this.handle.getDirectoryHandle(
            "thumbnails",
            { create: true }
        );

        let imageBlob: Blob = image;
        let thumbnailBlob: Blob = await jimp.resize(image);

        //Если изображение испорчено, то испортить файл изображения.
        if (manifest.corrupted) {
            imageBlob = await crypto.corrupt(image);
            thumbnailBlob = await crypto.corrupt(thumbnailBlob);
        }

        //Запись файлов.
        await fs.writeFile(
            imageDataFolderHandle,
            manifest.id + ".json",
            JSON.stringify(manifest)
        );
        await fs.writeFile(imageFileFolderHandle, img.getUrl().file, imageBlob);
        await fs.writeFile(
            imageThumbnailFolderHandle,
            img.getUrl().thumbnail,
            thumbnailBlob
        );

        //Добавление изображения в коллекцию.
        this.addImage(img);

        //Добавление тегов в коллекцию.
        for (const tag of manifest.tags) {
            this.addTag(tag);
        }

        return img;
    }

    /**
     * Создание нового сета Изображений.
     * @param images Массив с Изображениями.
     */
    async createSet(images: Array<ImageSingle | ImageSet>) {
        if (images.length == 0) throw new Error("Image set cannot be empty");
        const imageDataFolderHandle = await this.handle.getDirectoryHandle(
            "imageData"
        );

        //Данные для создания сета.
        const manifest: ImageSetData = {
            dateCreated: Date(),
            id:
                Math.random().toString(36).substr(2) +
                Math.random().toString(36).substr(2),
        };

        const image = new ImageSet(
            manifest,
            images
                .map((image) => {
                    if ("arr" in image) {
                        return image.arr;
                    } else {
                        return image;
                    }
                })
                .flat()
        );
        this.addImage(image);

        //Данные для сохранения сета.
        const savedManifest: ImageSetSavedData = {
            dateCreated: manifest.dateCreated,
            id: manifest.id,
            set: [],
        };

        for (const image of images) {
            if ("arr" in image) {
                savedManifest.set.push(...image.arr.map((i) => i.manifest));
            } else {
                savedManifest.set.push(image.manifest);
            }

            await imageDataFolderHandle.removeEntry(image.manifest.id + ".json");
            this.removeImage(image);
        }
        await fs.writeFile(
            imageDataFolderHandle,
            manifest.id + ".json",
            JSON.stringify(savedManifest)
        );
    }

    /**
     * Удаление Изображения из Коллекции.
     * Удаляет все данные связанные с данным Изображением.
     * @param image Объект Изображения.
     */
    async deleteImage(image: ImageSingle | ImageSet): Promise<void> {
        try {
            const imageDataFolderHandle = await this.handle.getDirectoryHandle(
                "imageData",
                { create: true }
            );
            const imageFileFolderHandle = await this.handle.getDirectoryHandle(
                "images",
                { create: true }
            );
            const imageThumbnailFolderHandle = await this.handle.getDirectoryHandle(
                "thumbnails",
                { create: true }
            );
            //let status = false;
            const promises: Promise<void>[] = [];

            if ("arr" in image) {
                for (const imageSingle of image.arr) {
                    promises.push(
                        imageFileFolderHandle.removeEntry(imageSingle.getUrl().file)
                    );
                    promises.push(
                        imageThumbnailFolderHandle.removeEntry(
                            imageSingle.getUrl().thumbnail
                        )
                    );
                }
                promises.push(
                    imageDataFolderHandle.removeEntry(image.manifest.id + ".json")
                );
            } else {
                promises.push(
                    imageDataFolderHandle.removeEntry(image.manifest.id + ".json")
                );
                promises.push(
                    imageFileFolderHandle.removeEntry(image.getUrl().file)
                );
                promises.push(
                    imageThumbnailFolderHandle.removeEntry(image.getUrl().thumbnail)
                );
            }

            const temp = await Promise.allSettled(promises);
            this.removeImage(image);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    /**
     * Удаление изображения из коллекции без удаления файлов этого изображения.
     * При следующем запуске изображение снова окажется в коллекции.
     * @param image Объект изображения.
     */
    removeImage(image: ImageSingle | ImageSet | ImageSingleData | string) {
        if (typeof image == "string") {
            const index = this.arr.findIndex((i) => i.manifest.id == image);
            if (index != -1) this.arr.splice(index, 1);
        } else if ("imageHandle" in image) {
            const index = this.arr.findIndex(
                (i) => i.manifest.id == image.manifest.id
            );
            if (index != -1) this.arr.splice(index, 1);
        } else if ("arr" in image) {
            const index = this.arr.findIndex(
                (i) => i.manifest.id == image.manifest.id
            );
            if (index != -1) this.arr.splice(index, 1);
        } else {
            const index = this.arr.findIndex((i) => i.manifest.id == image.id);
            if (index != -1) this.arr.splice(index, 1);
        }
    }

    /**
     * Обновление изображения.
     * @param image Объект изображения.
     * @param data Обновляемые данные.
     */
    async updateImage(
        image: ImageSingle | ImageSet,
        data?: ImageUpdateData
    ): Promise<void> {
        //Замена изображения.
        if (data?.imageData) {
            await this._updateBlob(image, data.imageData);
        }

        //Обновление данных об изображении.
        if (data?.manifest) {
            await this._updateManifest(image);
        }

        //Отделение изображений от сета.
        if (data?.separate && "arr" in image) {
            await this._updateSeparate(image, data.separate);
        }

        //Порча изображения.
        if (data?.corrupt) {
            const temp = this.manifest.options?.corrupted;
            await this._updateCorrupt(image, temp!);
        }
    }

    /**
     * Обновление manifest файла изображения.
     * @param image Объект изображения.
     */
    private async _updateManifest(image: ImageSingle | ImageSet) {
        const manifestFolderHandle = await this.handle.getDirectoryHandle(
            "imageData"
        );
        let manifest: ImageSingleData | ImageSetSavedData | null = null;

        if ("arr" in image) {
            manifest = image.manifest as ImageSetSavedData;
            manifest.set = [];
            manifest.set.push(...image.arr.map((i) => i.manifest));
        } else {
            manifest = image.manifest;
        }

        await fs.writeFile(
            manifestFolderHandle,
            manifest.id + ".json",
            JSON.stringify(manifest)
        );
    }

    /**
     * Обновление blob изображения.
     * @param image Объект изображения.
     * @param data Новые изображения.
     */
    private async _updateBlob(
        image: ImageSingle | ImageSet,
        data: { [key: string]: Blob }
    ) {
        const imageFolderHandle = await this.handle.getDirectoryHandle("images");
        const thumbnailFolderHandle = await this.handle.getDirectoryHandle(
            "thumbnails"
        );

        for (const key in data) {
            let tempImage: ImageSingle | null = null;

            //Получение объекта изображания, к которому относится blob.
            if ("arr" in image) {
                const temp = image.arr.find((i) => i.manifest.id == key);
                if (temp) tempImage = temp;
                else throw new Error("Wrong image id");
            } else {
                if (image.manifest.id == key) tempImage = image;
                else throw new Error("Wrong image id");
            }

            if (tempImage) {
                let blobImage = data[key];
                let blobThumbnail = await jimp.resize(data[key]);

                //Если tempImage.manifest.corrupted == false и fileUrl.includes('.dpx').
                //То что-то работает не ток как надо, файл будет обычным png, но считаться порченным.
                //Фикс.
                /*if (
                    !tempImage.manifest.corrupted &&
                    (tempImage.manifest.fileUrl.includes(".dpx") ||
                        tempImage.manifest.previewFileUrl.includes(".tpx"))
                ) {
                    tempImage.manifest.corrupted = true;
                }*/

                //Порча нового blob, если это необходимо.
                if (tempImage.manifest.corrupted) {
                    blobImage = await crypto.corrupt(blobImage);
                    blobThumbnail = await crypto.corrupt(blobThumbnail);
                }

                const imageHandle = await fs.writeFile(
                    imageFolderHandle,
                    tempImage.getUrl().file,
                    blobImage
                );
                const thumbnailHandle = await fs.writeFile(
                    thumbnailFolderHandle,
                    tempImage.getUrl().thumbnail,
                    blobThumbnail
                );

                tempImage.imageHandle = imageHandle;
                tempImage.thumbnailHandle = thumbnailHandle;
            }
        }
    }

    /**
     * Разделение сета на отдельные изображения.
     * @param image Разделяемый сет.
     * @param data Массив с изображениями, которые надо отделить от сета.
     */
    private async _updateSeparate(image: ImageSet, data: ImageSingle[]) {
        for (const imageSingle of data) {
            const index = image.arr.findIndex(
                (i) => i.manifest.id == imageSingle.manifest.id
            );
            if (index != -1) {
                image.removeImage(imageSingle);
                this.addImage(imageSingle);
                await this._updateManifest(imageSingle);
            }
        }

        //Отделение единственного оставшегося изображения в сете,
        //т. к. в сете не может быть 1 изображение.
        if (image.arr.length == 1) {
            const imageSingle = image.arr[0];
            image.removeImage(imageSingle);
            this.addImage(imageSingle);
            await this._updateManifest(imageSingle);
        }

        //Удаление сета, если в нем не осталось изображений.
        //Обновление manifest файла сета, если в нем остались изображения.
        if (image.arr.length == 0) {
            await this.deleteImage(image);
        } else {
            await this._updateManifest(image);
        }
    }

    /**
     * Порча изображения.
     * @param image Объект изображения.
     * @param corrupt Испортить изображение, или восстановить.
     */
    private async _updateCorrupt(image: ImageSingle | ImageSet, corrupt = true) {
        const imageFolderHandle = await this.handle.getDirectoryHandle("images");
        const thumbnailFolderHandle = await this.handle.getDirectoryHandle(
            "thumbnails"
        );

        const promises: Promise<any>[] = [];
        let manifestChanged = false;

        if ("arr" in image) {
            for (const imageSingle of image.arr) {
                await __corrupt(imageSingle);
            }
        } else {
            await __corrupt(image);
        }

        await Promise.allSettled(promises);
        //Обновление manifest изображения, если были проведены какие либо операции.
        if (manifestChanged) {
            await this._updateManifest(image);
        }

        async function __corrupt(image: ImageSingle) {
            const oldUrl = image.getUrl();
            /*try {
                imageBuffer = await (
                    await (await image.getImage()).getFile()
                ).arrayBuffer();

                thumbnailBuffer = await (
                    await (await image.getThumbnail()).getFile()
                ).arrayBuffer();

            } catch (err) {
                console.log('image.manifest.corrupted inconsistency');
                image.manifest.corrupted = corrupt;
                manifestChanged = true;
                return;
            }*/

            const imageBuffer = await (
                await (await image.getImage()).getFile()
            ).arrayBuffer();
            const thumbnailBuffer = await (
                await (await image.getThumbnail()).getFile()
            ).arrayBuffer();

            //Проверка изображения и превью на порченность.
            const imageCorrupted = await crypto.isCorrupted(imageBuffer);
            const thumbnailCorrupted = await crypto.isCorrupted(thumbnailBuffer);

            //Превью или изображение испорчены.
            if (imageCorrupted || thumbnailCorrupted) {
                if (corrupt) {
                    //Изображения испорчены, но это не указано в manifest файле.
                    //Исправление manifest файла.
                    if (!image.manifest.corrupted) {
                        image.manifest.corrupted = true;
                        manifestChanged = true;
                    }
                    return;
                }

                image.manifest.corrupted = false;
                manifestChanged = true;

                //Восстановление изображения.
                if (imageCorrupted) {
                    const imageNewData = await crypto.recover(imageBuffer);
                    promises.push(imageFolderHandle.removeEntry(oldUrl.file));
                    promises.push(
                        fs.writeFile(
                            imageFolderHandle,
                            image.getUrl().file,
                            imageNewData
                        )
                    );
                    image.imageHandle = null;
                }

                //Восстановление превью.
                if (thumbnailCorrupted) {
                    const thumbnailNewData = await crypto.recover(thumbnailBuffer);
                    promises.push(
                        thumbnailFolderHandle.removeEntry(oldUrl.thumbnail)
                    );
                    promises.push(
                        fs.writeFile(
                            thumbnailFolderHandle,
                            image.getUrl().thumbnail,
                            thumbnailNewData
                        )
                    );
                    image.thumbnailHandle = null;
                }

                return;
            }

            //Изображение не испорчено
            if (corrupt) {
                image.manifest.corrupted = true;
                manifestChanged = true;

                //Порча изображения.
                if (!imageCorrupted) {
                    const imageNewData = await crypto.corrupt(imageBuffer);
                    promises.push(imageFolderHandle.removeEntry(oldUrl.file));
                    promises.push(
                        fs.writeFile(
                            imageFolderHandle,
                            image.getUrl().file,
                            imageNewData
                        )
                    );
                    image.imageHandle = null;
                }

                //Порча превью.
                if (!thumbnailCorrupted) {
                    const thumbnailNewData = await crypto.corrupt(thumbnailBuffer);
                    promises.push(
                        thumbnailFolderHandle.removeEntry(oldUrl.thumbnail)
                    );
                    promises.push(
                        fs.writeFile(
                            thumbnailFolderHandle,
                            image.getUrl().thumbnail,
                            thumbnailNewData
                        )
                    );
                    image.thumbnailHandle = null;
                }

                return;
            }
        }
    }

    /**
     * Удаление папки с коллекцией.
     */
    async deleteCollection() {
        const handle = fs.getHandle();
        await handle.removeEntry(this.manifest.name, { recursive: true });
    }

    /**
     * Обновление информации об коллекции.
     * @param manifest информация о коллекции.
     * @param thumbnail опциональный thumbnail файл.
     */
    async updateCollectionManifest(
        manifest: CollectionManifest,
        thumbnail?: Blob
    ) {
        fs.writeFile(this.handle, "manifest.json", JSON.stringify(manifest));
        this.manifest = manifest;

        if (thumbnail) {
            const handle = await fs.writeFile(
                this.handle,
                "thumbnail.png",
                await jimp.resize(thumbnail)
            );
            this.thumbnail = handle;
        }
    }
}

export default CollectionOjbect;
