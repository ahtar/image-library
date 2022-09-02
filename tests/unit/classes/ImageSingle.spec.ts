import ImageSingle from "@/classes/ImageSingle";
import handles from "../../helpers/handles";
import memento from "@/modules/memento";

describe("ImageSingle.ts", () => {
    let image: ImageSingle | null = null;
    beforeEach(() => {
        const options = {
            id: "mock id",
            hash: "mock hash",
            tags: ["mock tag 1", "mock tag 2"],
            type: 'image/png',
            dateCreated: "mock dateCreated",
            dateEdited: "mock dateEdited",
            description: "mock description",
        };
        image = new ImageSingle(options, handles.getNewDirectoryHandle());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("создается", () => {
        const options = {
            id: "mock id",
            hash: "mock hash",
            tags: ["mock tag 1", "mock tag 2"],
            type: 'image/png',
            dateCreated: "mock dateCreated",
            dateEdited: "mock dateEdited",
            description: "mock description",
        };
        const image = new ImageSingle(options, handles.getNewDirectoryHandle());

        expect(image.manifest.id).toBe(options.id);
        expect(image.manifest.hash).toBe(options.hash);
        expect(image.manifest.tags.length).toBe(options.tags.length);
        expect(image.manifest.dateCreated).toBe(options.dateCreated);
        expect(image.manifest.dateEdited).toBe(options.dateEdited);
        expect(image.manifest.description).toBe(options.description);
    });

    it("loadImage загружает FileHandle изображения", async () => {
        expect(image!.imageHandle).toBeNull();

        await image!.loadImage();

        expect(image!.imageHandle).toBeDefined();
    });

    it("loadThumbnail загружает FileHandle thumbnail изображения", async () => {
        expect(image!.thumbnailHandle).toBeNull();

        await image!.loadThumbnail();

        expect(image!.thumbnailHandle).toBeDefined();
    });

    it("getImage возвращает FileHandle изображения", async () => {
        const handle = await image!.getImage();
        expect(handle).toBeDefined();
    });

    it("getThumbnail возвращает FileHandle thumbnail изображения", async () => {
        const handle = await image!.getThumbnail();
        expect(handle).toBeDefined();
    });

    it("saveState сохраняет состояние изображения", () => {
        const spySave = jest.spyOn(memento, "save");

        image!.saveState();

        expect(spySave).toBeCalledTimes(1);
    });

    it("restoreState восстанавливает сохраненное состояние изображения", () => {
        image!.saveState();
        image!.manifest.hash = "new mock hash";
        image!.restoreState();

        expect(image!.manifest.hash).not.toBe("new mock hash");
    });

    it("checkChanges проверяет на наличие изменений в изображении", () => {
        image!.saveState();
        image!.manifest.hash = "new mock hash";

        expect(image!.checkChanges()).toBe(true);

        image!.restoreState();

        expect(image!.checkChanges()).toBe(false);
    });
});
