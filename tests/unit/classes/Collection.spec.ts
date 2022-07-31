import Collection from "@/classes/Collection";
import ImageSingle from "@/classes/ImageSingle";
import ImageSet from "@/classes/ImageSet";

import fs from "@/modules/file-system";
import crypto from "@/modules/crypto";

jest.mock("@/classes/ImageSet");
jest.mock("@/classes/ImageSingle");
jest.mock("@/modules/jimp.ts");
jest.mock("@/modules/crypto.ts");
jest.mock("@/modules/file-system");

const directoryHandle = {
    kind: "directory" as const,
    name: "mocked name",
    isSameEntry: jest.fn(),
    queryPermission: jest.fn(),
    requestPermission: jest.fn(),
    getDirectoryHandle: jest.fn(),
    getFileHandle: jest.fn(async () => fileHandle),
    getFile: jest.fn(),
    getDirectory: jest.fn(),
    getEntries: jest.fn(),
    removeEntry: jest.fn(),
    resolve: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries() {
        let i = 0;
        const temp: AsyncIterableIterator<
            [string, FileSystemDirectoryHandle | FileSystemFileHandle]
        > = {
            async next(): Promise<
                IteratorResult<
                    [string, FileSystemDirectoryHandle | FileSystemFileHandle]
                >
            > {
                if (i < 5) {
                    i++;
                    return {
                        done: false,
                        value: ["", fileHandle],
                    };
                }
                return {
                    done: true,
                    value: ["", fileHandle],
                };
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };

        return temp;
    },
    [Symbol.asyncIterator]: jest.fn(),
    isFile: false as const,
    isDirectory: true as const,
};

const fileHandle = {
    kind: "file" as const,
    name: "mocked name",
    isSameEntry: jest.fn(),
    queryPermission: jest.fn(),
    requestPermission: jest.fn(),
    getFile: jest.fn(async () => new globalThis.File([], "fileName")),
    createWritable: jest.fn(),
    isFile: true as const,
    isDirectory: false as const,
};

directoryHandle.getDirectoryHandle.mockImplementation(
    async () => directoryHandle
);

describe("Collection.ts", () => {
    beforeEach(() => {
        //Тестовая json строка с данными коллекции.
        globalThis.File.prototype.text = jest
            .fn()
            .mockImplementationOnce(async () => '{"name":"mock collection"}');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Коллекция Инициализируется", () => {
        const options = {
            name: "test collection",
            created: "test date",
            description: "test description",
            theme: "test theme",
            lastModified: "test date",
            options: {
                corrupted: true,
            },
        };

        const collection = new Collection(options, fileHandle, directoryHandle);

        expect(collection.manifest.name).toBe(options.name);
        expect(collection.manifest.created).toBe(options.created);
        expect(collection.manifest.description).toBe(options.description);
        expect(collection.manifest.theme).toBe(options.theme);
        expect(collection.manifest.lastModified).toBe(options.lastModified);
        expect(collection.manifest.options?.corrupted).toBe(true);

        const optionsTwo = {
            name: "test name",
            created: "test date",
        };
        const collectionTwo = new Collection(
            optionsTwo,
            fileHandle,
            directoryHandle
        );

        expect(collectionTwo.manifest.name).toBe(optionsTwo.name);
        expect(collectionTwo.manifest.created).toBe(options.created);
        expect(collectionTwo.manifest.description).toBe(undefined);
        expect(collectionTwo.manifest.theme).toBe(undefined);
        expect(collectionTwo.manifest.lastModified).toBe(undefined);
        expect(collectionTwo.manifest.options?.corrupted).toBe(false);
    });

    it("fromFolderHandle создает новую коллекцию", async () => {
        const collection = await Collection.fromFolderHandle(directoryHandle);

        expect(collection).toBeDefined();
        expect(collection?.manifest.name).toBe("mock collection");
    });

    it("initLoadCollection инициализирует коллекцию", async () => {
        const collection = await Collection.fromFolderHandle(directoryHandle);

        //Тестовые json строки с данными изображений, полученные из XXX.json файла с помощью fileHandle.getFile().text().
        globalThis.File.prototype.text = jest
            .fn()
            .mockImplementationOnce(async () => '{"id":"1","tags":["mock tag 1"]}')
            .mockImplementationOnce(async () => '{"id":"2","tags":["mock tag 12"]}')
            .mockImplementationOnce(
                async () =>
                    '{"id":"3","tags":["mock tag 1"],"set":[{"id":"6","tags":["mock tag 1"]},{"id":"9","tags":["mock tag 1"]}]}'
            )
            .mockImplementationOnce(
                async () =>
                    '{"id":"4","tags":["mock tag 1"],"set":[{"id":"7","tags":["mock tag 1"]},{"id":"10","tags":["mock tag 12"]}]}'
            )
            .mockImplementationOnce(
                async () =>
                    '{"id":"5","tags":["mock tag 12"],"set":[{"id":"8","tags":["mock tag 1"]},{"id":"11","tags":["mock tag 1"]}]}'
            );

        //Коллекция не инициализированна.
        expect(collection!.arr.length).toBe(0);
        expect(collection!.loaded).toBe(false);

        await collection!.initLoadCollection();

        //Коллекция инициализированна.
        expect(collection!.arr.length).toBe(5);
        expect(collection!.loaded).toBe(true);
    });

    it("addTag добавляет новый тег", async () => {
        const collection = await Collection.fromFolderHandle(directoryHandle);

        expect(collection!.tags.length).toBe(0);

        collection!.addTag("test tag");

        expect(collection!.tags.length).toBe(1);
    });

    it("getTag Возвращает тег", async () => {
        const collection = await Collection.fromFolderHandle(directoryHandle);

        expect(collection!.getTag("test tag").name).toBe("test tag");
        expect(collection!.getTag("test tag").count).toBe(0);

        collection!.addTag("test tag");

        expect(collection!.getTag("test tag").count).toBe(1);
    });

    it("addImage добавляет новое изображение", async () => {
        const collection = await Collection.fromFolderHandle(directoryHandle);

        expect(collection!.arr.length).toBe(0);

        collection!.addImage(new ImageSingle("" as any, "" as any));
        expect(collection!.arr.length).toBe(1);

        collection!.addImage([
            new ImageSingle("" as any, "" as any),
            new ImageSet("" as any, "" as any),
        ]);
        expect(collection!.arr.length).toBe(3);
    });

    describe("createImage", () => {
        it("создает новое изображение", async () => {
            const spyWriteFile = jest.spyOn(fs, "writeFile");
            const spyCorrupt = jest.spyOn(crypto, "corrupt");
            const collection = await Collection.fromFolderHandle(directoryHandle);

            expect(collection!.arr.length).toBe(0);

            await collection!.createImage(
                {
                    hash: "",
                    id: "",
                    tags: [],
                    fileUrl: "",
                    previewFileUrl: "",
                    dateCreated: "",
                },
                new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
            );

            expect(collection!.arr.length).toBe(1);
            //Было создано 3 новых файла.
            expect(spyWriteFile).toBeCalledTimes(3);
            //изображение не было испорчено.
            expect(spyCorrupt).toBeCalledTimes(0);
        });

        it("портит изображение", async () => {
            const spyCorrupt = jest.spyOn(crypto, "corrupt");
            const collection = await Collection.fromFolderHandle(directoryHandle);

            expect(collection!.arr.length).toBe(0);

            await collection!.createImage(
                {
                    hash: "",
                    id: "",
                    tags: [],
                    fileUrl: "",
                    previewFileUrl: "",
                    dateCreated: "",
                    corrupted: true,
                },
                new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
            );

            expect(collection!.arr.length).toBe(1);
            //Изображение было испорчено.
            expect(spyCorrupt).toBeCalledTimes(2);
        });
    });

    describe("createSet", () => {
        it("создает новый сет", async () => {
            const spyWriteFile = jest.spyOn(fs, "writeFile");
            const spyRemoveEntry = jest.spyOn(directoryHandle, "removeEntry");
            const collection = await Collection.fromFolderHandle(directoryHandle);

            expect(collection!.arr.length).toBe(0);

            await collection!.createSet([
                new ImageSingle({} as any, {} as any),
                new ImageSingle({} as any, {} as any),
                new ImageSingle({} as any, {} as any),
                new ImageSet({} as any, {} as any),
            ]);

            expect(collection!.arr.length).toBe(1);
            //Создан 1 manifest файл нового сета.
            expect(spyWriteFile).toBeCalledTimes(1);
            //Удалено 4 manifest файла изображений, из которых создан сет.
            expect(spyRemoveEntry).toBeCalledTimes(4);
        });

        it("выдает ошибку при попытке создания пустого сета", async () => {
            const collection = await Collection.fromFolderHandle(directoryHandle);

            await expect(async () => {
                await collection!.createSet([]);
            }).rejects.toThrowError("Image set cannot be empty");
        });
    });

    it("deleteImage удаляет изображение с удалением файлов", async () => {
        const spyRemoveEntry = jest.spyOn(directoryHandle, "removeEntry");
        const collection = await Collection.fromFolderHandle(directoryHandle);
        const image = new ImageSingle("" as any, "" as any);
        const imageSet = new ImageSet("" as any, "" as any);

        //Добавление ImageSingle.
        collection!.addImage(image);
        expect(collection!.arr.length).toBe(1);

        //Удаление ImageSIngle.
        //Удалено 3 файла.
        await collection!.deleteImage(image);
        expect(spyRemoveEntry).toBeCalledTimes(3);
        expect(collection!.arr.length).toBe(0);

        //Добавление ImageSet с 2 изображениями.
        collection!.addImage(imageSet);
        expect(collection!.arr.length).toBe(1);

        //Удаление ImageSet.
        //Удалено ещё 5 файлов.
        await collection!.deleteImage(imageSet);
        expect(spyRemoveEntry).toBeCalledTimes(8);
        expect(collection!.arr.length).toBe(0);
    });

    it("removeImage удаляет изображение без удаления файлов", async () => {
        const spyRemoveEntry = jest.spyOn(directoryHandle, "removeEntry");
        const collection = await Collection.fromFolderHandle(directoryHandle);
        const image = new ImageSingle("" as any, "" as any);

        //Добавление ImageSingle.
        collection!.addImage(image);
        expect(collection!.arr.length).toBe(1);

        //Удаление ImageSIngle.
        //Ни 1 файл не удален.
        collection!.removeImage(image);
        expect(spyRemoveEntry).toBeCalledTimes(0);
    });

    describe("UpdateImage", () => {
        it("ничего не делает, если не указать параметры", async () => {
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const spyUpdateManifest = jest.spyOn(
                collection as any,
                "_updateManifest"
            );
            const spyUpdateBlob = jest.spyOn(collection as any, "_updateBlob");
            const spyUpdateSeparate = jest.spyOn(
                collection as any,
                "_updateSeparate"
            );
            const spyUpdateCorrupt = jest.spyOn(collection as any, "_updateCorrupt");

            const image = new ImageSet("" as any, "" as any);
            collection!.addImage(image);

            await collection!.updateImage(image);

            expect(spyUpdateManifest).toBeCalledTimes(0);
            expect(spyUpdateBlob).toBeCalledTimes(0);
            expect(spyUpdateSeparate).toBeCalledTimes(0);
            expect(spyUpdateCorrupt).toBeCalledTimes(0);
        });

        it("обновляет данные об изображении", async () => {
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const spyUpdateManifest = jest.spyOn(
                collection as any,
                "_updateManifest"
            );

            const image = new ImageSet("" as any, "" as any);
            collection!.addImage(image);

            await collection!.updateImage(image, { manifest: true });

            expect(spyUpdateManifest).toBeCalledTimes(1);
        });

        it("обновляет blob изображения", async () => {
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const spyUpdateBlob = jest.spyOn(collection as any, "_updateBlob");

            const image = new ImageSet("" as any, "" as any);
            collection!.addImage(image);

            await collection!.updateImage(image, {
                imageData: { [image.arr[0].manifest.id]: new Blob() },
            });

            expect(spyUpdateBlob).toBeCalledTimes(1);
        });

        it("разделяет сет", async () => {
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const spyUpdateSeparate = jest.spyOn(
                collection as any,
                "_updateSeparate"
            );

            const image = new ImageSet("" as any, "" as any);
            collection!.addImage(image);

            await collection!.updateImage(image, { separate: [image.arr[0]] });

            expect(spyUpdateSeparate).toBeCalledTimes(1);
        });

        it("портит изображение", async () => {
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const spyUpdateCorrupt = jest.spyOn(collection as any, "_updateCorrupt");

            const image = new ImageSet("" as any, "" as any);
            collection!.addImage(image);

            await collection!.updateImage(image, { corrupt: true });

            expect(spyUpdateCorrupt).toBeCalledTimes(1);
        });

        describe("_updateManifest", () => {
            it("обновляет manifest изображения", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const collection = await Collection.fromFolderHandle(directoryHandle);

                await collection!["_updateManifest"](
                    new ImageSet("" as any, "" as any)
                );

                expect(spyWriteFile).toBeCalledTimes(1);
            });
        });

        describe("_updateBlob", () => {
            it("заменяет blob изображения", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSet("" as any, "" as any);

                await collection!["_updateBlob"](image, {
                    [image.arr[0].manifest.id]: new Blob(),
                });

                //Были перезаписаны image и thumbnail файлы.
                expect(spyWriteFile).toBeCalledTimes(2);
            });

            it("заменяет сразу несколько blob", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSet("" as any, "" as any);

                await collection!["_updateBlob"](image, {
                    [image.arr[0].manifest.id]: new Blob(),
                    [image.arr[1].manifest.id]: new Blob(),
                });

                expect(spyWriteFile).toBeCalledTimes(4);
            });

            it("не портит blob изображения, если этого не требуется", async () => {
                const spyCorrupt = jest.spyOn(crypto, "corrupt");
                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSet("" as any, "" as any);

                await collection!["_updateBlob"](image, {
                    [image.arr[0].manifest.id]: new Blob(),
                });

                //Blob не был испорчен, потому что imageSingle.manifest.corrupted == false
                expect(spyCorrupt).toBeCalledTimes(0);
            });

            it("портит blob изображения, если это требуется", async () => {
                const spyCorrupt = jest.spyOn(crypto, "corrupt");
                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSet("" as any, "" as any);

                image.arr[0].manifest.corrupted = true;

                await collection!["_updateBlob"](image, {
                    [image.arr[0].manifest.id]: new Blob(),
                });

                //Blob был испорчен, потому что imageSingle.manifest.corrupted == true
                expect(spyCorrupt).toBeCalledTimes(2);
            });

            it("выдает ошибку при неправильном id изображения", async () => {
                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSet("" as any, "" as any);

                await expect(
                    async () =>
                        await collection!["_updateBlob"](image, { wrong_id: new Blob() })
                ).rejects.toThrowError("Wrong image id");
            });
        });

        describe("_updateSeparate", () => {
            it("отделяет 1 изображение от сета", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const collection = await Collection.fromFolderHandle(directoryHandle);

                const imageSet = new ImageSet("" as any, "" as any);
                imageSet.addImage(new ImageSingle("" as any, "" as any));
                collection!.addImage(imageSet);

                //В коллекции 1 сет, в этом сете 3 изображения.
                expect(collection!.arr.length).toBe(1);
                expect(imageSet.arr.length).toBe(3);

                await collection!["_updateSeparate"](imageSet, [imageSet.arr[0]]);

                //В коллекции 1 сет и 1 изображение, в сете 2 изображения.
                expect(collection!.arr.length).toBe(2);
                expect(imageSet.arr.length).toBe(2);
                //Был создан 1 новый manifest файл, и обновлен manifest файл сета.
                expect(spyWriteFile).toBeCalledTimes(2);
            });

            it("отделяет несколько изображений от сета", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const collection = await Collection.fromFolderHandle(directoryHandle);

                const imageSet = new ImageSet("" as any, "" as any);
                imageSet.addImage(new ImageSingle("" as any, "" as any));
                imageSet.addImage(new ImageSingle("" as any, "" as any));
                collection!.addImage(imageSet);

                //В коллекции 1 сет, в этом сете 4 изображения.
                expect(collection!.arr.length).toBe(1);
                expect(imageSet.arr.length).toBe(4);

                await collection!["_updateSeparate"](imageSet, [
                    imageSet.arr[0],
                    imageSet.arr[1],
                ]);

                //В коллекции 1 сет и 2 изображения, в сете 2 изображения.
                expect(collection!.arr.length).toBe(3);
                expect(imageSet.arr.length).toBe(2);
                //Было создано 2 новых manifest файла, и обновлен manifest файл сета.
                expect(spyWriteFile).toBeCalledTimes(3);
            });

            it("полностью разделяет сет на изображения", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const spyRemoveEntry = jest.spyOn(directoryHandle, "removeEntry");
                const collection = await Collection.fromFolderHandle(directoryHandle);

                const imageSet = new ImageSet("" as any, "" as any);
                imageSet.addImage(new ImageSingle("" as any, "" as any));
                collection!.addImage(imageSet);

                //В коллекции 1 сет, в этом сете 3 изображения.
                expect(collection!.arr.length).toBe(1);
                expect(imageSet.arr.length).toBe(3);

                await collection!["_updateSeparate"](imageSet, [
                    imageSet.arr[0],
                    imageSet.arr[1],
                    imageSet.arr[2],
                ]);

                //В коллекции 3 изображения.
                expect(collection!.arr.length).toBe(3);
                //Сет пустой.
                expect(imageSet.arr.length).toBe(0);
                //Было создано 3 новых manifest файла.
                expect(spyWriteFile).toBeCalledTimes(3);
                //Был удален manifest файл сета.
                expect(spyRemoveEntry).toBeCalledTimes(1);
            });

            it("разделяет сет, если в нём осталось 1 изображение", async () => {
                const spyWriteFile = jest.spyOn(fs, "writeFile");
                const spyRemoveEntry = jest.spyOn(directoryHandle, "removeEntry");
                const collection = await Collection.fromFolderHandle(directoryHandle);

                const imageSet = new ImageSet("" as any, "" as any);
                imageSet.addImage(new ImageSingle("" as any, "" as any));
                collection!.addImage(imageSet);

                //В коллекции 1 сет, в этом сете 3 изображения.
                expect(collection!.arr.length).toBe(1);
                expect(imageSet.arr.length).toBe(3);

                await collection!["_updateSeparate"](imageSet, [
                    imageSet.arr[0],
                    imageSet.arr[1],
                ]);

                //В коллекции 3 изображения.
                expect(collection!.arr.length).toBe(3);
                //Сет пустой.
                expect(imageSet.arr.length).toBe(0);
                //Было создано 3 новых manifest файла.
                expect(spyWriteFile).toBeCalledTimes(3);
                //Был удален manifest файл сета.
                expect(spyRemoveEntry).toBeCalledTimes(1);
            });
        });

        describe("_updateCorrupt", () => {
            it("портит изображение", async () => {
                crypto.isCorrupted = jest.fn(async () => false);
                const spyCorrupt = jest.spyOn(crypto, "corrupt");
                const spyWriteFile = jest.spyOn(fs, "writeFile");

                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSingle("" as any, "" as any);

                collection!.addImage(image);

                expect(image.manifest.corrupted).toBeFalsy();

                await collection!["_updateCorrupt"](image);

                //Изображение стало порченным.
                //Испорчено 2 blob.
                //Перезаписано 2 blob файла и 1 manifest файл.
                expect(image.manifest.corrupted).toBe(true);
                expect(spyCorrupt).toBeCalledTimes(2);
                expect(spyWriteFile).toBeCalledTimes(3);
            });

            it("восстанавливает изображение", async () => {
                crypto.isCorrupted = jest.fn(async () => true);
                const spyRecover = jest.spyOn(crypto, "recover");
                const spyWriteFile = jest.spyOn(fs, "writeFile");

                const collection = await Collection.fromFolderHandle(directoryHandle);
                const image = new ImageSet("" as any, "" as any);
                image.arr[0].manifest.corrupted = true;
                image.arr[1].manifest.corrupted = true;

                collection!.addImage(image);

                expect(image.arr[1].manifest.corrupted).toBe(true);

                await collection!["_updateCorrupt"](image, false);

                //Изображение стало нормальным.
                //Восстановленно 4 blob.
                //Перезаписано 4 blob файла и 1 manifest файл.
                expect(image.arr[1].manifest.corrupted).toBe(false);
                expect(spyRecover).toBeCalledTimes(4);
                expect(spyWriteFile).toBeCalledTimes(5);
            });
        });
    });

    it("deleteCollection удаляет папку с коллекцией", async () => {
        const spyRemoveEntry = jest.spyOn(fs.getHandle(), "removeEntry");
        const collection = await Collection.fromFolderHandle(directoryHandle);

        await collection!.deleteCollection();

        expect(spyRemoveEntry).toBeCalledTimes(1);
    });

    describe("updateCollectionManifest", () => {
        it("обновляет manifest файл", async () => {
            const spyWriteFile = jest.spyOn(fs, "writeFile");
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const manifest: CollectionManifest = {
                name: "new mock name",
                created: "new mock date",
            };

            expect(collection!.manifest).not.toBe(manifest);

            await collection!.updateCollectionManifest(manifest);

            expect(collection!.manifest).toBe(manifest);
            expect(spyWriteFile).toBeCalledTimes(1);
        });

        it("обновляет thumbnail файл", async () => {
            const spyWriteFile = jest.spyOn(fs, "writeFile");
            const collection = await Collection.fromFolderHandle(directoryHandle);
            const manifest: CollectionManifest = {
                name: "new mock name",
                created: "new mock date",
            };

            await collection!.updateCollectionManifest(manifest, new Blob());

            expect(spyWriteFile).toBeCalledTimes(2);
        });
    });
});
