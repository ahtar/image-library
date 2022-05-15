import { useCollections } from '@/store/collections';
import { defineStore } from 'pinia'
import Collection from '@/classes/Collection'
import jimp from '@/modules/jimp'

import useFileSystem from '@/composables/file-system'

/**
 * Надо будет обновить, подправить
 */
export const useCollectionCreateStore = defineStore('collectionCreate', {
    state: () => {
        return {
            visible: false,
            urlInputActive: true,
            imageInputActive: true,
            form: {
                name: '',
                description: '',
                theme: '',
                blob: undefined as Blob | undefined,
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

        clearForm() {
            this.form.name = '';
            this.form.description = '';
            this.form.theme = '';
            this.form.blob = undefined;
        },


        /**
         * Создание новой Коллекции на основе введеных пользователем данных.
         */
        async createCollection() {
            const { getHandle, writeFile } = useFileSystem();
            const store = useCollections();

            const handle = getHandle();

            /**
             * Проверка, существует ли Коллекция с заданых пользователем именем,
             * если не существует, то приступить к созданию.
             */
            try {
                await handle.getDirectoryHandle(this.form.name);
                console.log('Коллекция уже существует!');
            } catch(err) {
                const error = err as DOMException;
                if(error.NOT_FOUND_ERR == 8) {
                    const collectionHandle = await handle.getDirectoryHandle(this.form.name, {create: true});
                    const manifest: CollectionManifest = {
                        name: this.form.name,
                        theme: this.form.theme || '',
                        description: this.form.description || '',
                        created: Date(),
                        lastModified: Date(),
                    };
                    const thumbnail = await jimp.resize(this.form.blob!);

                    await collectionHandle.getDirectoryHandle('imageData', {create: true});
                    await collectionHandle.getDirectoryHandle('images', {create: true});
                    await collectionHandle.getDirectoryHandle('thumbnails', {create: true});
                    await writeFile(collectionHandle, 'manifest.json', JSON.stringify(manifest));
                    const thumbnailHandle = await writeFile(collectionHandle, 'thumbnail.png', thumbnail);

                    const collection = new Collection(manifest, thumbnailHandle, collectionHandle);
                    store.addCollection(collection);
                } else {
                    console.log(error);
                }
            }
        }

    }
});