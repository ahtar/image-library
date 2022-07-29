//import Jimp from "jimp/es";

const Jimp = () => import(/* webpackChunkName: "jimp" */"jimp/es");

async function getHash(image: Blob) {
    const buffer = await image.arrayBuffer();
    const jimpImage = await (await Jimp()).default.read(buffer);
    return jimpImage.hash();
}

async function resize(data: Blob, max = { x: 160, y: 200 }) {
    const image = await (await Jimp()).default.read(await data.arrayBuffer());
    if (image.bitmap.width > image.bitmap.height) {
        await image.resize(max.x, (await Jimp()).default.AUTO);
    } else {
        await image.resize((await Jimp()).default.AUTO, max.y);
    }

    //buffer to blob
    const tempData = await image.getBufferAsync(image.getMIME());
    return new Blob([(tempData as Uint8Array).buffer]);
}

export default {
    getHash,
    resize,
};
