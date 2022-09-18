const cache: { [key: string]: string } = {};

function save<T>(data: T, key: string): void {
    cache[key] = JSON.stringify(data);
}

function restore<T>(key: string): T | null {
    if (key in cache) {
        const t = JSON.parse(cache[key]) as T;
        return t;
    }
    return null;
}

function getString(key: string): string | null {
    if (key in cache) {
        return cache[key];
    }
    return null;
}

function clear(key: string): void {
    if (key in cache) {
        delete cache[key];
    }
}

function log(key?: string): void {
    if (key) console.info(`${key} state:`, cache[key]);
    else console.info('cache state:', cache);
}

export default {
    save,
    restore,
    clear,
    log,
    getString,
};
