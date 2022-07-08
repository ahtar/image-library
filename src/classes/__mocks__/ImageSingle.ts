

const mockClass = jest.fn(() => {
    return {
        manifest: {
            id: 'mock id',
            hash: 'mock hash',
            tags: ['mock tag 1', 'mock tag 2'],
            fileUrl: 'mock fileUrl',
            previewFileUrl: 'mock previewFileUrl',
            dateCreated: 'mock dateCreated',
            dateEdited: 'mock dateEdited',
            description: 'mock description'
        },
        collectionHandle: {
            kind: 'directory',
            name: 'mocked name',
            isSameEntry: jest.fn(),
            queryPermission: jest.fn(),
            requestPermission: jest.fn(),
            getDirectoryHandle: jest.fn(),
            getFileHandle: jest.fn(),
            removeEntry: jest.fn(),
            resolve: jest.fn(),
            keys: jest.fn(),
            values: jest.fn(),
            entries: jest.fn(),
            [Symbol.asyncIterator]: jest.fn(),
            isFile: false,
            isDirectory: true
        },
        imageHandle: {
            kind: 'file',
            name: 'mocked name',
            isSameEntry: jest.fn(),
            queryPermission: jest.fn(),
            requestPermission: jest.fn(),
            getFile: jest.fn(() => {
                return { type: 'testType' }
            }),
            createWritable: jest.fn(),
            isFile: true,
            isDirectory: false,
        },
        thumbnailHandle: {
            kind: 'file',
            name: 'mocked name',
            isSameEntry: jest.fn(),
            queryPermission: jest.fn(),
            requestPermission: jest.fn(),
            getFile: jest.fn(),
            createWritable: jest.fn(),
            isFile: true,
            isDirectory: false,
        },
        loadImage: jest.fn(),
        loadThumbnail: jest.fn(),
        getImage() {
            return this.imageHandle;
        },
        getThumbnail: jest.fn(),
        saveState: jest.fn(),
        restoreState: jest.fn(),
        checkChanges: jest.fn()
    }
});

export default mockClass;