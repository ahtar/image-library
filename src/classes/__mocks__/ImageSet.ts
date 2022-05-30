jest.mock('@/classes/ImageSingle');
import ImageSingle from '@/classes/ImageSingle'

const mockClass = jest.fn(() => {
    return {
        manifest: {
            set: [
                {
                    id: 'mock id',
                    hash: 'mock hash',
                    tags: ['mock tag 1', 'mock tag 2'],
                    fileUrl: 'mock fileUrl',
                    previewFileUrl: 'mock previewFileUrl',
                    dateCreated: 'mock dateCreated',
                    dateEdited: 'mock dateEdited',
                    description: 'mock description'
                },
                {
                    id: 'mock id',
                    hash: 'mock hash',
                    tags: ['mock tag 1', 'mock tag 2'],
                    fileUrl: 'mock fileUrl',
                    previewFileUrl: 'mock previewFileUrl',
                    dateCreated: 'mock dateCreated',
                    dateEdited: 'mock dateEdited',
                    description: 'mock description'
                }
            ],
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
    
            index = this.manifest.set.findIndex((img) => img.id == image.manifest.id);
            if(index != -1) this.manifest.set.splice(index, 1);
        },
    }
});

export default mockClass;