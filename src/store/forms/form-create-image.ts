import { useCollections } from '@/store/collections';
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
         * Открытие формы.
         */
        open() {
            this.visible = true;
        },
        /**
         * Закрытие формы.
         */
        close() {
            this.visible = false;
        },

        /**
         * Обработка формы.
         * Получение ArrayBuffer.
         * Валидация объекта изображения.
         * Создание тегов.
         * Создание изображения.
         */
         submitImage() {
            const storeCollections = useCollections();

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

            for(const tag of this.form.tags) {
                imageInstance.tags.push(tag);
            }

            const obj = {
                manifest: imageInstance,
                imageBlob: this.form.blob!
            };

            this.visible = false;
            this.clearForm();

            return obj;
        },

        //сброс данных формы
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