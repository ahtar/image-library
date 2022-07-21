import Collection from "@/classes/Collection";
import { get, set } from "idb-keyval";

import usePermissions from "@/composables/permissions";
const { verifyPermission } = usePermissions();

let handler: FileSystemDirectoryHandle;

let callback: any;

/**
 * Проверка, есть ли доступ к папке с Коллекциями.
 * @returns status.
 */
async function checkMainFolderAccess() {
  const data: FileSystemDirectoryHandle | undefined = await get("entryHandle");
  if (data == undefined) return false;
  if (Array.isArray(data) && data.length == 0) return false;

  handler = data;

  return verifyPermission(data);
}

/**
 * Запрос папки с коллекциями.
 */
async function requestMainFolderAccess() {
  try {
    handler = await window.showDirectoryPicker();
    await set("entryHandle", handler);
    if (callback) callback();
  } catch (err) {
    console.log(err);
  }
}

/**
 * Загрузка файла из полученного FileHandle.
 * @param handle FileHandle требуемого файла.
 * @returns Файл.
 */
async function loadFile(handle: FileSystemFileHandle) {
  const data = await handle.getFile();
  return data;
}

/**
 * Запись файла в предоставленную папку.
 * @param handle DirectoryHandle папки.
 * @param name Название файла.
 * @param content Содержимое файла.
 * @returns FileHandle созданного файла.
 */
async function writeFile(
  handle: FileSystemDirectoryHandle,
  name: string,
  content: FileSystemWriteChunkType
) {
  try {
    const fileHandler = await handle.getFileHandle(name, { create: true });
    const stream = await fileHandler.createWritable();
    await stream.write(content);
    await stream.close();
    return fileHandler;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * Получение всех коллекций пользователя.
 * @returns Массив с коллекциями.
 */
async function initLoadCollections() {
  const arr: Array<Collection> = [];

  if (handler != undefined) {
    for await (const [key, h] of handler.entries()) {
      if (h.kind == "directory") {
        const collection = await Collection.fromFolderHandle(h);
        if (collection) arr.push(collection);
      }
    }
  }

  return arr;
}

/**
 * Получение DirectoryHandle папки приложения.
 * @returns DirectoryHandle папки приложения.
 */
function getHandle() {
  return handler;
}

export default {
  checkMainFolderAccess,
  requestMainFolderAccess,
  writeFile,
  loadFile,
  initLoadCollections,
  getHandle,
};
