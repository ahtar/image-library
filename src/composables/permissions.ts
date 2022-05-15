import { get, set } from 'idb-keyval'



async function test() {
    return get('entryHandle');
}

async function verifyPermission(handle: any, readWrite = true) {
    const options: any = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await handle.queryPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}


export default function() {
    return {
        test,
        verifyPermission,
    }
}