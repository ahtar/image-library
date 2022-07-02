import { defineStore } from 'pinia'

import useFileSystem from '@/composables/file-system'

const { requestMainFolderAccess, initLoadCollections } = useFileSystem();


export const useInitStore = defineStore('init', {
    state: () => {
        return {
            visible: false,
        }
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
        }
    }
});