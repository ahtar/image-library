import { useCollections } from '@/store/collections';
import { useNotificationStore } from '@/store/modals/modal-notification';
import { defineStore } from 'pinia';
import i18n from '@/locales/i18n';

/**
 * Надо будет обновить, подправить
 */
export const useImageCreateStore = defineStore('imageCreate', {
    state: () => {
        return {
            visible: false,
            urlInputActive: true,
            imageInputActive: true,
            form: {
                tags: [] as Array<string>,
                file: undefined as File | undefined,
                source: '',
                fileUrl: '',
                hash: '',
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
         * Отправление запроса в Collection на сохранение изображения.
         */
        async submitImage() {
            const store = useCollections();
            const storeNotifications = useNotificationStore();
            const id =
                Math.random().toString(36).substr(2) +
                Math.random().toString(36).substr(2);

            if (!store.activeCollection) return;
            if (!this.form.file) return;

            //Информация об изображении.
            const imageInstance: ImageSingleData = {
                id: id,
                hash: this.form.hash,
                dateCreated: Date(),
                tags: [],
                type: this.form.file.type,
                corrupted:
                    store.activeCollection?.manifest.options?.corrupted ||
                    false,
            };

            //Создание тегов
            for (const tag of this.form.tags) {
                imageInstance.tags.push(tag);
            }

            //Запоминание тегов нового изображения.
            store.activeCollection.lastTags = [];
            for (const tag of imageInstance.tags) {
                store.activeCollection.lastTags.push(
                    store.activeCollection.getTag(tag)
                );
            }

            this.visible = false;

            try {
                //Отправление запроса.
                await store.activeCollection.createImage(
                    imageInstance,
                    this.form.file
                );
                this.clearForm();

                storeNotifications.notify(
                    i18n.global.t('NOTIFICATION.MESSAGE.IMAGE_CREATED')
                );
            } catch (err) {
                console.log(err);
                storeNotifications.notify(
                    i18n.global.t('NOTIFICATION.MESSAGE.IMAGE_CREATE_ERROR'),
                    false
                );
            }
        },

        /**
         * Сброс данных окна.
         */
        clearForm() {
            this.urlInputActive = true;
            this.imageInputActive = true;
            this.form.tags.length = 0;
            this.form.file = undefined;
            this.form.source = '';
            this.form.fileUrl = '';
            this.form.hash = '';
        },
    },
});
