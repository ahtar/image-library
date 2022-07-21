const n = 700;

const patterns = [
  {
    n: 700,
    falseDataOne: [255, 255, 50, 50],
    falseDataTwo: [255, 110, 1, 1, 5, 10, 255],
  },
];

function concatTypedArrays(data: Uint8Array[]) {
  const length = data.reduce((val, arr) => (val = val + arr.length), 0);
  const temp = new Uint8Array(length);
  let offset = 0;

  for (let i = 0; i < data.length; i++) {
    temp.set(data[i], offset);
    offset += data[i].length;
  }

  return temp;
}

function encrypt() {
  console.log("temp");
}

function decrypt() {
  console.log("temp");
}

/**
 * Контролируемая порча файла.
 * Вставляет случайные данные в определенное место в файле, делая его "порченным".
 */
async function corrupt(data: Blob | ArrayBuffer) {
  let arrayBuffer: ArrayBuffer;

  if ("arrayBuffer" in data) {
    arrayBuffer = await data.arrayBuffer();
  } else {
    arrayBuffer = data;
  }

  const uint8Array = new Uint8Array(arrayBuffer);
  const firstPart = uint8Array.slice(0, n);
  const secondPart = uint8Array.slice(n);
  const falseDataOne = new Uint8Array([255, 255, 50, 50]);
  const falseDataTwo = new Uint8Array([255, 110, 1, 1, 5, 10, 255]);
  const mergedArray = concatTypedArrays([
    falseDataOne,
    firstPart,
    falseDataTwo,
    secondPart,
  ]);

  return new Blob([mergedArray.buffer]);
}

/**
 * Восстанавливает испорченный файл.
 */
async function recover(data: Blob | ArrayBuffer) {
  let arrayBuffer: ArrayBuffer;

  if ("arrayBuffer" in data) {
    arrayBuffer = await data.arrayBuffer();
  } else {
    arrayBuffer = data;
  }

  const uint8Array = new Uint8Array(arrayBuffer);
  const firstPart = uint8Array.slice(4, n + 4);
  const secondPart = uint8Array.slice(n + 4 + 7);
  const mergedArray = concatTypedArrays([firstPart, secondPart]);

  return new Blob([mergedArray.buffer]);
}

async function isCorrupted(data: Blob | ArrayBuffer) {
  let arrayBuffer: ArrayBuffer;

  if ("arrayBuffer" in data) {
    arrayBuffer = await data.arrayBuffer();
  } else {
    arrayBuffer = data;
  }

  const uint8Array = new Uint8Array(arrayBuffer);

  const firstPart =
    uint8Array.slice(0, 4).toString() == [255, 255, 50, 50].toString();
  const secondPart =
    uint8Array.slice(n + 4, n + 4 + 7).toString() ==
    [255, 110, 1, 1, 5, 10, 255].toString();

  return firstPart && secondPart;
}

export default {
  encrypt,
  decrypt,
  corrupt,
  recover,
  isCorrupted,
};
