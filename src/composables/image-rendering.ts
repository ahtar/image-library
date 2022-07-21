import crypto from "@/modules/crypto";

/**
 * Изменение src изображения.
 * @param image DOM элемент.
 * @param file src изображения.
 * @returns новый ObjectURL изображения.
 */
async function renderImage(
  image: HTMLImageElement,
  file: FileSystemFileHandle | string | Blob | undefined
): Promise<string> {
  let data: string | null = null;

  if (file) {
    if (typeof file == "string") {
      data = file;
    } else {
      if ("getFile" in file) {
        if (file.name.includes(".dpx") || file.name.includes(".tpx")) {
          const tempData = await file.getFile();
          const arrayBuffer = await tempData.arrayBuffer();
          data = URL.createObjectURL(await crypto.recover(arrayBuffer));
        } else {
          data = URL.createObjectURL(await file.getFile());
        }
      } else {
        data = URL.createObjectURL(file);
      }
    }
  }

  return new Promise((resolve) => {
    const src = image.src;

    if (src != undefined) {
      URL.revokeObjectURL(src);
    }

    if (data) {
      //ожидание прогрузки изображения
      image.onload = function () {
        resolve(data!);
      };
      image.src = data;
    } else {
      image.src = "";
      resolve("");
    }
  });
}

function releaseImage(image: HTMLImageElement) {
  if (image.src != "") {
    URL.revokeObjectURL(image.src);
  }
}

export default function () {
  return {
    renderImage,
    releaseImage,
  };
}
