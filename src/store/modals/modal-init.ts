import { defineStore } from 'pinia'


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
        }
    }
});