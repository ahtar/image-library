interface Options {
    set: Array<ImageSingleData>,
    id: string,
    dateCreated: string,
    dateEdited?: string,
}


class ImageSetObject implements ImageSet {
    manifest: ImageSetData;
    arr: ImageSingle[];

    constructor(options: Options, arr: ImageSingle[] = []) {
        this.manifest = {
            set: options.set,
            id: options.id,
            dateCreated: options.dateCreated,
            dateEdited: options.dateEdited
        };
        this.arr = arr;
    }

    addImage(image: ImageSingle) {
        this.arr.push(image);
    }

    /**
     * Remove image from image set.
     * @param image 
     */
    removeImage(image: ImageSingle) {
        //Remove image from physical array.
        let index = this.arr.findIndex((img) => img.manifest.id == image.manifest.id);
        if(index != -1) this.arr.splice(index, 1);

        //Remove image from manifest array.
        index = this.manifest.set.findIndex((img) => img.id == image.manifest.id);
        if(index != -1) this.manifest.set.splice(index, 1);
    }
}




export default ImageSetObject;