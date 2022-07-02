import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/modals/modal-notification'



export const useCollections = defineStore('collections', {
    state: () => {
        return {

            collections: [] as Array<Collection>,

            activeCollection: null as null | Collection,

            collectionsInitialized: false,
        }
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
            if(col) return col;
            return null;
        },

        /**
         * Добавление новых коллекций.
         * @param collection Коллекции, которые необходимо добавить.
         */
        addCollection(collection: Collection | Array<Collection>) {
            this.collectionsInitialized = true;
            if(Array.isArray(collection)) {
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
                const index = this.collections.findIndex((c) => c.manifest.name == collection.manifest.name);

                if(index != -1) {
                    this.collections.splice(index, 1);
                    await collection.deleteCollection();
                    storeNotifications.notify('Коллекция удалена.');
                }
            } catch(err) {
                console.log(err);
                storeNotifications.notify('Коллекция не была удалена.', false);
            }
        }
    }
});