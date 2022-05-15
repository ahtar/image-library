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

        setActiveCollection(collectionIndex: number) {
            const collection = this.collections[collectionIndex];
            this.activeCollection = collection;
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
        }
    }
});