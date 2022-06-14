import { defineStore } from 'pinia'

export const useCollectionEditStore = defineStore('collectionEdit', {
    state: () => {
        return {
            visible: false,
            form: {
                name: '',
                theme: '' as string | undefined,
                description: '' as string | undefined,
                blob: null as Blob | null
            },
            collection: null as Collection | null
        }
    },
    actions: {
        close() {
            this.visible = false;
        },
        async open(collection: Collection) {
            this.visible = true;
            this.collection = collection;
            this.form.name = collection.manifest.name;
            this.form.theme = collection.manifest.theme;
            this.form.description = collection.manifest.description;
            this.form.blob = await collection.thumbnail.getFile();
        },

        //Отправление запроса на обновление данных коллекции.
        save() {
            const manifest = {
                name: this.form.name,
                theme: this.form.theme,
                description: this.form.description,
                created: this.collection!.manifest.created,
                lastModified: Date()
            };
            this.collection?.updateCollectionManifest(manifest, this.form.blob!);
        }
    }
});