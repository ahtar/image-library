import { defineStore } from 'pinia'

export const useImageViewStore = defineStore('imageView', {
    state: () => {
        return {
            visible: false,
            image: null as ImageSingle | ImageSet | null
        }
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
    }
});