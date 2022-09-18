import { defineStore } from 'pinia';

export const useProgressBarStore = defineStore('progressBar', {
    state: () => {
        return {
            visible: false,
            max: 0,
            value: 0,
        };
    },

    getters: {},

    actions: {
        show() {
            this.visible = true;
        },

        close() {
            this.visible = false;
        },

        init(max: number) {
            this.max = max;
            this.value = 0;
            this.show();

            console.log(this);
        },

        increment(num = 1) {
            if (this.value) this.value += num;
            else this.value = num;
        },
    },
});
