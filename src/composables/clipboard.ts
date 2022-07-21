import crypto from "@/modules/crypto";
/**
 * Копирование изображения в буфер обмена.
 * @param data Объект изображения.
 */
async function copyToClipboard(data: ImageSingle | ImageSet) {
  let item: null | ClipboardItem = null;
  if ("arr" in data) {
    const image = data.arr[0];

    if (image.manifest.corrupted) {
      const blob = await (
        await (await image.getImage()).getFile()
      ).arrayBuffer();
      const newBlob = await crypto.recover(blob);
      const file = new File([newBlob], image.manifest.id + ".png", {
        type: "image/png",
      });
      item = new ClipboardItem({ [file.type]: file });
    } else {
      const file = await (await image.getImage()).getFile();
      item = new ClipboardItem({ [file.type]: file });
    }
  } else {
    if (data.manifest.corrupted) {
      const blob = await (
        await (await data.getImage()).getFile()
      ).arrayBuffer();
      const newBlob = await crypto.recover(blob);
      const file = new File([newBlob], data.manifest.id + ".png", {
        type: "image/png",
      });
      item = new ClipboardItem({ [file.type]: file });
    } else {
      const file = await (await data.getImage()).getFile();
      item = new ClipboardItem({ [file.type]: file });
    }
  }

  if (item != null) await navigator.clipboard.write([item]);
}

/**
 * Чтение данных из буфера обмена.
 * @returns Данные из обмена обмена.
 */
async function readFromClipboard() {
  const data: any = await navigator.clipboard.read();
  return data;
}

export default function () {
  return {
    copyToClipboard,
    readFromClipboard,
  };
}
