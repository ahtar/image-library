import { useCollections } from '@/store/collections';
import { useNotificationStore } from '@/store/modals/modal-notification'
import { defineStore } from 'pinia'

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
                blob: undefined as Blob | undefined,
                source: '',
                fileUrl: '',
                hash: '',
            }
        }
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
            const id = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

            const imageInstance: ImageSingleData = {
                id: id,
                fileUrl: id + '.png',
                previewFileUrl: id + '.png',
                hash: this.form.hash,
                dateCreated: Date(),
                tags: [],
            };

            //создание ссылок на изображения
            imageInstance.fileUrl = imageInstance.id + '.' + this.form.blob?.type.split('/')[1];
            imageInstance.previewFileUrl = imageInstance.id + '.' + this.form.blob?.type.split('/')[1];

            //Создание тегов
            for(const tag of this.form.tags) {
                imageInstance.tags.push(tag);
            }

            //Запоминание тегов нового изображения.
            store.activeCollection!.lastTags = [];
            for(const tag of imageInstance.tags) {
                store.activeCollection!.lastTags.push(store.activeCollection!.getTag(tag));
            }

            try {
                //сохранение изображения.
                await store.activeCollection!.createImage(imageInstance, this.form.blob!);
                this.clearForm();
                storeNotifications.notify('Изображение создано!');
            } catch(err) {
                console.log(err);
                storeNotifications.notify('Изображение не было создано, что-то пошло не так.', false);
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
            this.form.source = '';
            this.form.fileUrl = '';
            this.form.hash = '';
        }
    }
});