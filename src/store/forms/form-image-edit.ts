import { useCollections } from '@/store/collections'
import { defineStore } from 'pinia'

export const useImageEditStore = defineStore('imageEdit', {
    state: () => {
        return {
            collectionsStore: useCollections(),
            visible: false,
            image: null as ImageSingle | ImageSet | null
        }
    },
    actions: {


        setImage(image: ImageSingle | ImageSet | null) {
            this.image = image;
        },


        open() {
            this.visible = true;
        },


        close() {
            this.visible = false;
        },

        updateImage() {
            if(this.image != undefined) {
                //const img: ImageSet | ImageSingle = this.image;
                //какая то странная ошибка
                this.collectionsStore.activeCollection?.updateImage(this.image as any);
            }
        },

        isSet() {
            if(this.image && 'set' in this.image) {
                return true;
            }
            return false;
        }
    }
});