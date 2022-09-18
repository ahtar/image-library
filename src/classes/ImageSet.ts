interface Options {
    id: string;
    dateCreated: string;
    dateEdited?: string;
}

import memento from '@/modules/memento';

class ImageSetObject implements ImageSet {
    manifest: ImageSetData;
    arr: ImageSingle[];

    constructor(options: Options, arr: ImageSingle[] = []) {
        this.manifest = {
            id: options.id,
            dateCreated: options.dateCreated,
            dateEdited: options.dateEdited,
        };
        this.arr = arr;
    }

    /**
     * Добавление изображения в сет.
     * @param image Объект изображения.
     */
    addImage(image: ImageSingle): void {
        this.arr.push(image);
    }

    /**
     * Удаление зображения из сета.
     * @param image Объект изображения.
     */
    removeImage(image: ImageSingle): void {
        const index = this.arr.findIndex(
            (img) => img.manifest.id == image.manifest.id
        );
        if (index != -1) this.arr.splice(index, 1);
    }

    /**
     * Сохранение состояния данных изображения для последующего восстановления.
     */
    saveState(): void {
        memento.save(
            {
                manifest: this.manifest,
                arrOrder: this.arr.map((i) => i.manifest.id),
            },
            this.manifest.id
        );
        for (const image of this.arr) {
            image.saveState();
        }
    }

    /**
     * Восстановление изображения в сохраненное состояние
     */
    restoreState(): void {
        const restoredData = memento.restore<ImageSetRestoredData>(
            this.manifest.id
        );
        if (restoredData) {
            this.manifest = restoredData.manifest;

            const tempArr: ImageSingle[] = [];
            for (const id of restoredData.arrOrder) {
                const image = this.arr.find((i) => i.manifest.id == id);
                if (image) tempArr.push(image);
            }
            this.arr = tempArr;
        }

        for (const image of this.arr) {
            image.restoreState();
        }
    }

    checkChanges(): boolean {
        const restoredStringData = memento.getString(this.manifest.id);
        const stringData = JSON.stringify({
            manifest: this.manifest,
            arrOrder: this.arr.map((i) => i.manifest.id),
        });

        for (const image of this.arr) {
            if (image.checkChanges()) return true;
        }
        if (restoredStringData == stringData) return false;
        else return true;
    }
}

export default ImageSetObject;
