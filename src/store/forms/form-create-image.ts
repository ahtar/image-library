import { useCollections } from "@/store/collections";
import { useNotificationStore } from "@/store/modals/modal-notification";
import { defineStore } from "pinia";
import i18n from "@/locales/i18n";

/**
 * Надо будет обновить, подправить
 */
export const useImageCreateStore = defineStore("imageCreate", {
    state: () => {
        return {
            visible: false,
            urlInputActive: true,
            imageInputActive: true,
            form: {
                tags: [] as Array<string>,
                blob: undefined as Blob | undefined,
                source: "",
                fileUrl: "",
                hash: "",
            },
        };
    },
    actions: {
        /**
         * Открытие окна.
         */
        open() {
            this.visible = true;
        },
        /**
         * Закрытие закрытие окна.
         */
        close() {
            this.visible = false;
        },

        /**
         * Сохранение нового изображения.
         */
        async submitImage() {
            const store = useCollections();
            const storeNotifications = useNotificationStore();
            const id =
                Math.random().toString(36).substr(2) +
                Math.random().toString(36).substr(2);

            const blobFormat = this.form.blob!.type.split("/")[1];

            //Информация об изображении.
            const imageInstance: ImageSingleData = {
                id: id,
                fileUrl: `${id}.${blobFormat}`,
                previewFileUrl: `${id}.${blobFormat}`,
                hash: this.form.hash,
                dateCreated: Date(),
                tags: [],
                corrupted: store.activeCollection?.manifest.options?.corrupted || false,
            };

            //Порча изображения.
            if (imageInstance.corrupted) {
                imageInstance.fileUrl = id + ".dpx";
                imageInstance.previewFileUrl = id + ".tpx";
            }

            //Создание тегов
            for (const tag of this.form.tags) {
                imageInstance.tags.push(tag);
            }

            //Запоминание тегов нового изображения.
            store.activeCollection!.lastTags = [];
            for (const tag of imageInstance.tags) {
                store.activeCollection!.lastTags.push(
                    store.activeCollection!.getTag(tag)
                );
            }

            try {
                //сохранение изображения.
                await store.activeCollection!.createImage(
                    imageInstance,
                    this.form.blob!
                );
                this.clearForm();
                storeNotifications.notify(i18n.global.t('NOTIFICATION.MESSAGE.IMAGE_CREATED'));
            } catch (err) {
                console.log(err);
                storeNotifications.notify(
                    i18n.global.t('NOTIFICATION.MESSAGE.IMAGE_CREATE_ERROR'),
                    false
                );
            }

            this.visible = false;
        },

        /**
         * Сброс данных окна.
         */
        clearForm() {
            this.urlInputActive = true;
            this.imageInputActive = true;
            this.form.tags.length = 0;
            this.form.blob = undefined;
            this.form.source = "";
            this.form.fileUrl = "";
            this.form.hash = "";
        },
    },
});
