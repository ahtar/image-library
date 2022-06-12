jest.mock("@/classes/Collection");

import CollectionOjbect from "@/classes/Collection";

export default jest.fn(() => {
    return {
        checkMainFolderAccess: jest.fn(() => true),
        requestMainFolderAccess: jest.fn(),
        loadFile: jest.fn(() => new File([], 'mock name')),
        writeFile: jest.fn(),
        initLoadCollections: jest.fn(() => [new CollectionOjbect({} as any, {} as any, {} as any)]),
        getHandle: jest.fn(() => {
            return {
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
            }
        }),
    }
});