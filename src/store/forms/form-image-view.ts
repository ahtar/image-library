import { defineStore } from "pinia";

export const useImageViewStore = defineStore("imageView", {
    state: () => {
        return {
            visible: false,
            image: null as ImageSingle | ImageSet | null,
        };
    },
    getters: {
        isSet: (state) => {
            if (state.image) {
                if ("arr" in state.image) return true;
            }
            return false;
        },
    },
    actions: {
        /**
         * Изменение просматриваемого изображения.
         * @param image Объект нового изображения.
         */
        setImage(image: ImageSingle | ImageSet | null) {
            this.image = image;
        },
        /**
         * Открытие окна просмотра.
         */
        open() {
            this.visible = true;
        },
        /**
         * Закрытие окна просмотра.
         */
        close() {
            this.visible = false;
        },
    },
});
