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

async function requestPermissions() {
    const clipboardRead = await navigator.permissions.query({ name: 'clipboard-read' as any});
    const clipboardWrite = await navigator.permissions.query({ name: 'clipboard-write' as any});
    console.log(clipboardRead);
    console.log(clipboardWrite);
}

export default function () {
    return {
        verifyPermission,
        requestPermissions,
    };
}
