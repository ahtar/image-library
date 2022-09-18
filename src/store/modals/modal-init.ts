import { defineStore } from 'pinia';

import fs from '@/modules/file-system';

const { requestMainFolderAccess, initLoadCollections } = fs;

export const useInitStore = defineStore('init', {
    state: () => {
        return {
            visible: false,
        };
    },

    getters: {
        checkCompatibility: () => {
            const options = [
                {
                    text: 'window.showDirectoryPicker',
                    data: window.showDirectoryPicker,
                },
                {
                    text: 'navigator.clipboard',
                    data: navigator.clipboard,
                },
                {
                    text: 'FileSystemFileHandle',
                    data: globalThis.FileSystemFileHandle?.prototype,
                },
                {
                    text: 'FileSystemWritableFileStream',
                    data: globalThis.FileSystemFileHandle?.prototype
                        .createWritable,
                },
            ];

            for (const opt of options) {
                if (opt.data == undefined) {
                    return false;
                }
            }
            return true;
        },
    },

    actions: {
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
        async requestFolderAccess() {
            await requestMainFolderAccess();
            const data = await initLoadCollections();
            return data;
        },
    },
});
