import { useCollections } from '@/store/collections';
import { useNotificationStore } from '@/store/modals/modal-notification';
import { defineStore } from 'pinia';
import Collection from '@/classes/Collection';
import jimp from '@/modules/jimp';
import fs from '@/modules/file-system';

import i18n from '@/locales/i18n';

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
                file: undefined as File | undefined,
                options: {
                    corrupted: false,
                },
            },
        };
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
            this.form.file = undefined;
            this.form.options.corrupted = false;
        },

        /**
         * Создание новой Коллекции на основе введеных пользователем данных.
         */
        async createCollection() {
            if (!this.form.file) return;
            const { getHandle, writeFile } = fs;
            const store = useCollections();
            const storeNotifications = useNotificationStore();

            const handle = getHandle();

            try {
                await handle.getDirectoryHandle(this.form.name);
                storeNotifications.notify(
                    i18n.global.t(
                        'NOTIFICATION.MESSAGE.COLLECTION_ALREADY_EXISTS'
                    ),
                    false
                );
            } catch (err) {
                const error = err as DOMException;
                if (error.NOT_FOUND_ERR == 8) {
                    const collectionHandle = await handle.getDirectoryHandle(
                        this.form.name,
                        { create: true }
                    );
                    const manifest: CollectionManifest = {
                        name: this.form.name,
                        theme: this.form.theme || '',
                        description: this.form.description || '',
                        created: Date(),
                        lastModified: Date(),
                        options: {
                            corrupted: this.form.options.corrupted,
                        },
                    };
                    const thumbnail = await jimp.resize(this.form.file);

                    await collectionHandle.getDirectoryHandle('imageData', {
                        create: true,
                    });
                    await collectionHandle.getDirectoryHandle('images', {
                        create: true,
                    });
                    await collectionHandle.getDirectoryHandle('thumbnails', {
                        create: true,
                    });
                    await writeFile(
                        collectionHandle,
                        'manifest.json',
                        JSON.stringify(manifest)
                    );
                    const thumbnailHandle = await writeFile(
                        collectionHandle,
                        'thumbnail.png',
                        thumbnail
                    );

                    const collection = new Collection(
                        manifest,
                        thumbnailHandle,
                        collectionHandle
                    );
                    store.addCollection(collection);

                    this.clearForm();
                    this.close();

                    storeNotifications.notify(
                        i18n.global.t('NOTIFICATION.MESSAGE.COLLECTION_CREATED')
                    );
                } else {
                    storeNotifications.notify(
                        i18n.global.t('NOTIFICATION.MESSAGE.ERROR'),
                        false
                    );
                    console.log(error);
                }
            }
        },
    },
});
