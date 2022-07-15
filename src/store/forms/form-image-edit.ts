import { useCollections } from '@/store/collections'
import { useNotificationStore } from '@/store/modals/modal-notification'
import { defineStore } from 'pinia'
import memento from '@/modules/memento'

export const useImageEditStore = defineStore('imageEdit', {
    state: () => {
        return {
            storeCollections: useCollections(),
            visible: false,
            image: null as ImageSingle | ImageSet | null,
            imageBlobChanges: {} as { [key:string] : Blob },
            imageSeparate: [] as ImageSingle[]
        }
    },
    getters: {
        isSet: (state) => {
            if(state.image) {
                if('arr' in state.image) return true;
            }
            return false;
        },
    },
    actions: {
        async setImage(image: ImageSingle | ImageSet) {
            this.image = image;

            this.imageBlobChanges = {};
            this.imageSeparate = [];

            this.image.saveState();
        },

        open() {
            this.visible = true;
        },

        close() {
            this.visible = false;
        },

        changeImageBlob(image: ImageSingle, data: Blob) {
            this.imageBlobChanges[image.manifest.id] = data;
        },

        /**
         * Отмена всех изменений изображения.
         */
        cancelUpdate() {
            this.image?.restoreState();
            this.close();
        },

        async updateImage() {
            const storeNotifications = useNotificationStore();

            const obj: ImageUpdateData = {};

            if(this.imageSeparate.length > 0) obj.separate = this.imageSeparate as any;
            if(Object.keys(this.imageBlobChanges).length > 0) obj.imageData = this.imageBlobChanges;
            if(this.image?.checkChanges()) obj.manifest = true;

            this.close();
            try {
                await this.storeCollections.activeCollection?.updateImage(this.image as any, obj);
            } catch(err) {
                console.log(err);
                storeNotifications.notify('Изображение не измененно, что-то пошло не так', false);
            }
        },

        /**
         * Отметить изображение для отделения от сета.
         * @param image 
         */
        async separateImage(image: ImageSingle) {
            const index = this.imageSeparate.findIndex((i) => i.manifest.id == image.manifest.id);
            if(index == -1) this.imageSeparate.push(image);
            else this.imageSeparate.splice(index, 1);
        }
    }
});