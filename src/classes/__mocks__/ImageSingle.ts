const mockClass = jest.fn(() => {
    const id = (Math.random().toString(36) + '00000000000000000').slice(2, 8);
    return {
        manifest: {
            id: id,
            hash: 'mock hash',
            tags: ['mock tag 1', 'mock tag 2'],
            dateCreated: Date(),
            dateEdited: Date(),
            description: 'mock description',
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
            isDirectory: true,
        },
        imageHandle: {
            kind: 'file',
            name: 'mocked name',
            isSameEntry: jest.fn(),
            queryPermission: jest.fn(),
            requestPermission: jest.fn(),
            getFile: jest.fn(() => {
                return {
                    type: 'image/png',
                    name: id + '.png',
                    arrayBuffer: jest.fn(),
                };
                //return new File(['(⌐□_□)'], id + '.png', { type: 'image/png' })
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
            getFile: jest.fn(() => {
                return {
                    type: 'testType',
                    name: id,
                    arrayBuffer: jest.fn(),
                };
            }),
            createWritable: jest.fn(),
            isFile: true,
            isDirectory: false,
        },
        loadImage: jest.fn(),
        loadThumbnail: jest.fn(),
        getImage() {
            return this.imageHandle;
        },
        getThumbnail() {
            return this.thumbnailHandle;
        },
        saveState: jest.fn(),
        restoreState: jest.fn(),
        checkChanges: jest.fn(),
        getUrl: jest.fn(() => {
            return {
                file: 'file',
                thumbnail: 'thumbnail',
            };
        }),
    };
});

export default mockClass;
