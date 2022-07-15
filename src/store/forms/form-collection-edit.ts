import { defineStore } from 'pinia'
import { useNotificationStore } from '@/store/modals/modal-notification'
import { usePromptStore } from '@/store/modals/modal-prompt'
import { useProgressBarStore } from '@/store/modals/modal-progress-bar'

export const useCollectionEditStore = defineStore('collectionEdit', {
    state: () => {
        return {
            visible: false,
            form: {
                name: '',
                theme: '' as string | undefined,
                description: '' as string | undefined,
                blob: null as Blob | null,
                options: {
                    corrupted: false
                }
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
            this.form.options.corrupted = collection.manifest.options?.corrupted || false
        },

        //Обновление данных коллекции.
        async save() {
            const storeNotification = useNotificationStore();
            const storePromt = usePromptStore();
            const storeProgressBar = useProgressBarStore();
            const oldCorruptedStatus = this.collection!.manifest.options?.corrupted;

            try {
                //Обновление manifest коллекции.
                const manifest = {
                    name: this.form.name,
                    theme: this.form.theme,
                    description: this.form.description,
                    created: this.collection!.manifest.created,
                    lastModified: Date(),
                    options: {
                        corrupted: this.form.options.corrupted || false
                    }
                };
                await this.collection!.updateCollectionManifest(manifest, this.form.blob!);

                //Конвертация изображений.
                let promtAnswer: boolean;
                if(oldCorruptedStatus != this.form.options.corrupted) {
                    if(this.form.options.corrupted) promtAnswer = await storePromt.showPrompt('Коллекция станет порченной. Конвентировать изображения?');
                    else promtAnswer = await storePromt.showPrompt('Коллекция станет обычной. Конвентировать изображения?');
                } else promtAnswer = false;

                if(promtAnswer) {
                    if(!this.collection?.loaded) {
                        await this.collection?.initLoadCollection();
                    }
                    storeProgressBar.init(this.collection!.arr.length);

                    for(const image of this.collection!.arr) {
                        await this.collection?.updateImage(image as any, { corrupt: true });
                        storeProgressBar.increment();
                    }

                    storeProgressBar.close();
                }

                this.close();
                storeNotification.notify('Информация о коллекции обновлена.');
            } catch(err) {
                console.log(err);
                storeNotification.notify('Что-то пошло не так.', false);
            }
        }
    }
});