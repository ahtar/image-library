//"виртуальное" пространство с файлами на устройстве.
const cache: { [key: string]: Array<FileSystemFileHandle> } = {};

//Mocked FileSystemDirectoryHandle.
class DirectoryHandle implements FileSystemDirectoryHandle {
  kind: "directory" = "directory";
  name: string;
  isFile: false = false;
  isDirectory: true = true;
  resolve = jest.fn();
  isSameEntry = jest.fn();
  queryPermission = jest.fn();
  requestPermission = jest.fn();
  constructor(name?: string) {
    this.name =
      name || (Math.random().toString(36) + "00000000000000000").slice(2, 8);
  }

  async getDirectory(name: string): Promise<FileSystemDirectoryHandle> {
    return new DirectoryHandle(name);
  }

  async getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle> {
    return new DirectoryHandle(name);
  }

  async getFileHandle(name: string): Promise<FileSystemFileHandle> {
    /*const item = cache[this.name]?.find(file => file.name == name);
        if(item) return item;
        throw new Error('File not found');*/

    return new FileHandle();
  }

  async getFile(name: string): Promise<FileSystemFileHandle> {
    return new FileHandle();

    /*const item = cache[this.name]?.find(file => file.name == name);
        if(item) return item;
        throw new Error('File not found');*/
  }

  async removeEntry(name: string) {
    const itemId = cache[this.name]?.findIndex((item) => item.name == name);
    if (itemId == -1) throw new Error("File not found");
    cache[this.name].splice(itemId, 1);
  }

  keys() {
    const _this = this;
    let i = 0;
    const j = cache[this.name]?.length || 0;

    const temp: AsyncIterableIterator<string> = {
      async next(): Promise<IteratorResult<string>> {
        if (j == 0) {
          return {
            done: true,
            value: undefined,
          };
        }
        if (i < j) {
          const file = await cache[_this.name][i].getFile();
          i++;
          return {
            done: false,
            value: file.name,
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };

    return temp;
  }

  values() {
    const _this = this;
    let i = 0;
    const j = cache[this.name]?.length || 0;

    const temp: AsyncIterableIterator<
      FileSystemDirectoryHandle | FileSystemFileHandle
    > = {
      async next(): Promise<
        IteratorResult<FileSystemDirectoryHandle | FileSystemFileHandle>
      > {
        if (j == 0) {
          return {
            done: true,
            value: undefined,
          };
        }
        if (i < j) {
          const value = cache[_this.name][i];
          i++;
          return {
            done: false,
            value,
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };

    return temp;
  }

  entries() {
    const _this = this;
    let i = 0;
    const j = cache[this.name]?.length || 0;

    const temp: AsyncIterableIterator<
      [string, FileSystemFileHandle | FileSystemDirectoryHandle]
    > = {
      async next(): Promise<
        IteratorResult<
          [string, FileSystemFileHandle | FileSystemDirectoryHandle]
        >
      > {
        if (j == 0) {
          return {
            done: true,
            value: undefined,
          };
        }
        if (i < j) {
          const file = cache[_this.name][i];
          const name = cache[_this.name][i].name;
          i++;
          return {
            done: false,
            value: [name, file],
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };

    return temp;
  }

  getEntries() {
    const _this = this;
    let i = 0;
    const j = cache[this.name]?.length || 0;

    const temp: AsyncIterableIterator<
      FileSystemDirectoryHandle | FileSystemFileHandle
    > = {
      async next(): Promise<
        IteratorResult<FileSystemDirectoryHandle | FileSystemFileHandle>
      > {
        if (j == 0) {
          return {
            done: true,
            value: undefined,
          };
        }
        if (i < j) {
          const value = cache[_this.name][i];
          i++;
          return {
            done: false,
            value,
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };

    return temp;
  }

  [Symbol.asyncIterator]() {
    const _this = this;
    let i = 0;
    const j = cache[this.name]?.length || 0;

    const temp: AsyncIterableIterator<
      [string, FileSystemFileHandle | FileSystemDirectoryHandle]
    > = {
      async next(): Promise<
        IteratorResult<
          [string, FileSystemFileHandle | FileSystemDirectoryHandle]
        >
      > {
        if (j == 0) {
          return {
            done: true,
            value: undefined,
          };
        }
        if (i < j) {
          const file = cache[_this.name][i];
          const name = cache[_this.name][i].name;
          i++;
          return {
            done: false,
            value: [name, file],
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };

    return temp;
  }
}

//Mocked FileSystemFileHandle.
class FileHandle implements FileSystemFileHandle {
  kind: "file" = "file";
  isFile: true = true;
  isDirectory: false = false;
  name: string;
  isSameEntry = jest.fn();
  queryPermission = jest.fn();
  requestPermission = jest.fn();
  constructor(name?: string) {
    this.name =
      name ||
      (Math.random().toString(36) + "00000000000000000").slice(2, 8) + ".png";
  }

  async getFile(): Promise<File> {
    const content = (Math.random().toString(36) + "00000000000000000").slice(
      2,
      8
    );
    const name = this.name;
    const file = new File([content], name, { type: "text/plain" });
    return file;
  }

  async createWritable(
    options?: FileSystemCreateWritableOptions | undefined
  ): Promise<FileSystemWritableFileStream> {
    return {
      write: jest.fn(),
      seek: jest.fn(),
      truncate: jest.fn(),
      locked: true,
      abort: jest.fn(),
      close: jest.fn(),
      getWriter: jest.fn(),
    };
  }
}

function getNewDirectoryHandle(name?: string) {
  return new DirectoryHandle(name);
}

function getNewFileHandle(name?: string) {
  return new FileHandle(name);
}

function createNewRandomFiles(handle: FileSystemDirectoryHandle, number = 1) {
  if (!cache[handle.name]) cache[handle.name] = [];
  const temp: Array<FileSystemFileHandle> = [];
  for (let i = 0; i < number; i++) {
    const file = new FileHandle();
    cache[handle.name].push(file);
    temp.push(file);
  }
  return temp;
}

function createNewNamedFile(handle: FileSystemDirectoryHandle, name: string) {
  if (!cache[handle.name]) cache[handle.name] = [];
  const file = new FileHandle(name);
  cache[handle.name].push(file);
  return file;
}

function getFiles(handle: FileSystemDirectoryHandle) {
  return cache[handle.name] || [];
}

export default {
  getNewDirectoryHandle,
  getNewFileHandle,
  createNewRandomFiles,
  createNewNamedFile,
  getFiles,
  DirectoryHandle,
  FileHandle,
};
