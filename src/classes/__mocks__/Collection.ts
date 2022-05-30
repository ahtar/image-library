

const mockedClass =  jest.fn(() => {
    return {
        manifest: {
            name: 'mocked name',
            created: 'mocked created date',
            description: 'mocked description',
            theme: 'mocked theme',
            lastModified: 'mocked lastModified date'
        },
        arr: [],
        tags: [],
        handle: {
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
        thumbnail: {
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
        initLoadCollection: jest.fn(),
        addTag: jest.fn(),
        getTag: jest.fn(),
        addImage: jest.fn(),
        createImage: jest.fn(),
        createSet: jest.fn(),
        deleteImage: jest.fn(),
        removeImage: jest.fn(),
        updateImage: jest.fn(),
        log: jest.fn(),
    }
});

export default mockedClass;