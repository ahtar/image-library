import { useCollections } from "@/store/collections";
import { useNotificationStore } from "@/store/modals/modal-notification";
import { defineStore } from "pinia";
import i18n from "@/locales/i18n";

export const useImageEditStore = defineStore("imageEdit", {
    state: () => {
        return {
            storeCollections: useCollections(),
            visible: false,
            image: null as ImageSingle | ImageSet | null,
            imageFileChanges: {} as { [key: string]: File },
            imageSeparate: [] as ImageSingle[],
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
        async setImage(image: ImageSingle | ImageSet) {
            this.image = image;

            this.imageFileChanges = {};
            this.imageSeparate = [];

            this.image.saveState();
        },

        open() {
            this.visible = true;
        },

        close() {
            this.visible = false;
        },

        changeImageFile(image: ImageSingle, data: File) {
            this.imageFileChanges[image.manifest.id] = data;
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

            if (this.imageSeparate.length > 0)
                obj.separate = this.imageSeparate as any;
            if (Object.keys(this.imageFileChanges).length > 0)
                obj.imageData = this.imageFileChanges;
            if (this.image?.checkChanges()) obj.manifest = true;

            this.close();
            try {
                await this.storeCollections.activeCollection?.updateImage(
                    this.image as any,
                    obj
                );
                storeNotifications.notify(
                    i18n.global.t('NOTIFICATION.MESSAGE.IMAGE_EDITED')
                );
            } catch (err) {
                console.log(err);
                storeNotifications.notify(
                    i18n.global.t('NOTIFICATION.MESSAGE.IMAGE_EDIT_ERROR'),
                    false
                );
            }
        },

        /**
         * Отметить изображение для отделения от сета.
         * @param image
         */
        async separateImage(image: ImageSingle) {
            const index = this.imageSeparate.findIndex(
                (i) => i.manifest.id == image.manifest.id
            );
            if (index == -1) this.imageSeparate.push(image);
            else this.imageSeparate.splice(index, 1);
        },
    },
});
