

async function copyToClipboard(data: ImageSingle | ImageSet) {
    let item: null | ClipboardItem = null;
    if('arr' in data) {
        const file = await (await data.arr[0].getImage()).getFile();
        item = new ClipboardItem({[file.type]: file});
    } else {
        const file = await (await data.getImage()).getFile();
        item = new ClipboardItem({[file.type]: file});
    }

    if(item != null) await navigator.clipboard.write([item]);
}

async function readFromClipboard() {
    const data: any = await navigator.clipboard.read();
    return data;
}




export default function() {
    return {
        copyToClipboard,
        readFromClipboard
    }
}