jest.mock('@/classes/ImageSingle');
import ImageSingle from '@/classes/ImageSingle'

const mockClass = jest.fn(() => {
    return {
        manifest: {
            id: 'mock id',
            dateCreated: 'mock dateCreated',
            dateEdited: 'mock dateEdited'
        },
        arr: [new ImageSingle({} as any, {} as any), new ImageSingle({} as any, {} as any)],
        addImage(image: ImageSingle) {
            this.arr.push(image);
        },
        removeImage(image: ImageSingle) {
            let index = this.arr.findIndex((img) => img.manifest.id == image.manifest.id);
            if(index != -1) this.arr.splice(index, 1);
        },
        saveState: jest.fn(),
        restoreState: jest.fn(),
        checkChanges: jest.fn()
    }
});

export default mockClass;