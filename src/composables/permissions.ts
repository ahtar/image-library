async function verifyPermission(handle: any, readWrite = true) {
    const options: any = {};
    if (readWrite) {
        options.mode = "readwrite";
    }
    if ((await handle.queryPermission(options)) === "granted") {
        return true;
    }
    return false;
}

export default function () {
    return {
        verifyPermission,
    };
}
