import ImageSet from "@/classes/ImageSet";
import ImageSingle from "@/classes/ImageSingle";
import memento from "@/modules/memento";

jest.mock("@/classes/ImageSingle");

describe("ImageSet.ts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("создается без изображений", () => {
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" });

    expect(imageSet.manifest.id).toBe("mock id");
    expect(imageSet.manifest.dateCreated).toBe("mock date");
    expect(imageSet.arr.length).toBe(0);
  });

  it("создается с изображениями", () => {
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" }, [
      new ImageSingle("" as any, "" as any),
    ]);

    expect(imageSet.manifest.id).toBe("mock id");
    expect(imageSet.manifest.dateCreated).toBe("mock date");
    expect(imageSet.arr.length).toBe(1);
  });

  it("addImage добавляет изображение в сет", () => {
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" });
    const imageSingle = new ImageSingle("" as any, "" as any);

    expect(imageSet.arr.length).toBe(0);

    imageSet.addImage(imageSingle);

    expect(imageSet.arr.length).toBe(1);
  });

  it("removeImage удалет изображение из сета", () => {
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" });
    const image = new ImageSingle("" as any, "" as any);

    imageSet.addImage(image);
    imageSet.addImage(new ImageSingle("" as any, "" as any));
    imageSet.addImage(new ImageSingle("" as any, "" as any));

    expect(imageSet.arr.length).toBe(3);

    imageSet.removeImage(image);

    expect(imageSet.arr.length).toBe(2);
  });

  it("saveState сохраняет состояние сета", () => {
    const spySave = jest.spyOn(memento, "save");
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" });

    imageSet.addImage(new ImageSingle("" as any, "" as any));
    imageSet.addImage(new ImageSingle("" as any, "" as any));

    imageSet.saveState();

    expect(spySave).toBeCalledTimes(1);
  });

  it("restoreState восстанавливает состояние сета", () => {
    const spySave = jest.spyOn(memento, "restore");
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" });

    imageSet.addImage(new ImageSingle("" as any, "" as any));
    imageSet.addImage(new ImageSingle("" as any, "" as any));
    const arrOrder = imageSet.arr.map((image) => image.manifest.id).join(" ");

    //Сохранение состояния сета.
    imageSet.saveState();

    //Изменение данных сета.
    imageSet.manifest.dateCreated = "new mock date";
    imageSet.arr.reverse();

    expect(imageSet.manifest.dateCreated).not.toBe("mock date");
    expect(imageSet.arr.map((image) => image.manifest.id).join(" ")).not.toBe(
      arrOrder
    );

    //Восстановление сохраненного состояния сета.
    imageSet.restoreState();

    expect(imageSet.manifest.dateCreated).toBe("mock date");
    expect(imageSet.arr.map((image) => image.manifest.id).join(" ")).toBe(
      arrOrder
    );
    expect(spySave).toBeCalledTimes(1);
  });

  it("checkChanges проверяет наличие изменений в сете", () => {
    const imageSet = new ImageSet({ id: "mock id", dateCreated: "mock date" });

    imageSet.addImage(new ImageSingle("" as any, "" as any));
    imageSet.addImage(new ImageSingle("" as any, "" as any));

    //Сохранение состояния сета.
    imageSet.saveState();

    //Изменение данных сета.
    imageSet.manifest.dateCreated = "new mock date";
    imageSet.arr.reverse();

    expect(imageSet.checkChanges()).toBe(true);

    //Восстановление сохраненного состояния сета.
    imageSet.restoreState();

    expect(imageSet.checkChanges()).toBe(false);
  });
});
