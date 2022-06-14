import { defineStore } from 'pinia'



export const useCollections = defineStore('collections', {
    state: () => {
        return {

            collections: [] as Array<Collection>,

            activeCollection: null as null | Collection,

            collectionsInitialized: false,
        }
    },
    actions: {

        setActiveCollection(collection: Collection) {
            this.activeCollection = collection;
        },

        getCollection(name: string) {
            const col = this.collections.find((c) => c.manifest.name === name);
            if(col) return col;
            return null;
        },

        addCollection(collection: Collection | Array<Collection>) {
            this.collectionsInitialized = true;
            if(Array.isArray(collection)) {
                for(const col of collection) {
                    this.collections.push(col);
                }
            } else {
                this.collections.push(collection);
            }
        },

        deleteCollection(collection: Collection) {
            const index = this.collections.findIndex((c) => c.manifest.name == collection.manifest.name);

            if(index != -1) {
                this.collections.splice(index, 1);
                collection.deleteCollection();
            }
        }
    }
});