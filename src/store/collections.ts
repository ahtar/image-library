import { defineStore } from 'pinia';
import { useNotificationStore } from '@/store/modals/modal-notification';
import i18n from '@/locales/i18n';
import CollectionClass from '@/classes/Collection';

export const useCollections = defineStore('collections', {
    state: () => {
        return {
            collections: [] as Array<Collection>,

            activeCollection: null as null | Collection,

            collectionsInitialized: false,
        };
    },
    actions: {
        /**
         * Смена активной коллекции.
         * @param collection Новая активная коллекция.
         */
        setActiveCollection(collection: Collection) {
            this.activeCollection = collection;
        },

        /**
         * Получение коллекции по её названию.
         * @param name Название коллекции.
         * @returns Запрошенная коллекция.
         */
        getCollection(name: string) {
            const col = this.collections.find((c) => c.manifest.name === name);
            if (col) return col;
            return null;
        },

        /**
         * Добавление новых коллекций.
         * @param collection Коллекции, которые необходимо добавить.
         */
        addCollection(collection: Collection | Array<Collection>) {
            this.collectionsInitialized = true;
            if (Array.isArray(collection)) {
                this.collections.push(...collection);
            } else {
                this.collections.push(collection);
            }
        },

        /**
         * Удаление коллекции.
         * @param collection Коллекция, которую необходимо удалить.
         */
        async deleteCollection(collection: Collection) {
            const storeNotifications = useNotificationStore();
            try {
                const index = this.collections.findIndex(
                    (c) => c.manifest.name == collection.manifest.name
                );

                if (index != -1) {
                    this.collections.splice(index, 1);
                    await collection.deleteCollection();
                    storeNotifications.notify(
                        i18n.global.t('NOTIFICATION.MESSAGE.COLLECTION_DELETED')
                    );
                }
            } catch (err) {
                console.log(err);
                storeNotifications.notify(
                    i18n.global.t(
                        'NOTIFICATION.MESSAGE.COLLECTION_DELETE_ERROR'
                    ),
                    false
                );
            }
        },

        /**
         * Получение и инициализация коллекций из полученого FileSystemDirectoryHandle
         * @param handle FileSystemDirectoryHandle папки с коллекциями.
         * @returns Массив с полученными коллекциями.
         */
        async loadCollections(handle: FileSystemDirectoryHandle) {
            const arr: Array<Collection> = [];

            for await (const [key, h] of handle.entries()) {
                key;
                if (h.kind == 'directory') {
                    const collection = await CollectionClass.fromFolderHandle(
                        h
                    );
                    if (collection) arr.push(collection);
                }
            }

            this.addCollection(arr);
            return arr;
        },
    },
});
