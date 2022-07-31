import { defineStore } from "pinia";
import { useNotificationStore } from "@/store/modals/modal-notification";
import { usePromptStore } from "@/store/modals/modal-prompt";
import { useProgressBarStore } from "@/store/modals/modal-progress-bar";
import i18n from "@/locales/i18n";

export const useCollectionEditStore = defineStore("collectionEdit", {
    state: () => {
        return {
            visible: false,
            form: {
                name: "",
                theme: "" as string | undefined,
                description: "" as string | undefined,
                file: null as File | null,
                options: {
                    corrupted: false,
                },
            },
            collection: null as Collection | null,
        };
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
            this.form.file = await collection.thumbnail.getFile();
            this.form.options.corrupted =
                collection.manifest.options?.corrupted || false;
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
                        corrupted: this.form.options.corrupted || false,
                    },
                };

                //обновление файлов коллекции
                await this.collection!.updateCollectionManifest(
                    manifest,
                    this.form.file!
                );

                //Конвертация изображений.
                let promtAnswer: boolean;
                if (oldCorruptedStatus != this.form.options.corrupted) {
                    if (this.form.options.corrupted)
                        promtAnswer = await storePromt.showPrompt(
                            i18n.global.t("PROMPT.COLL_CORR_CONVERT_IMAGES")
                        );
                    else
                        promtAnswer = await storePromt.showPrompt(
                            i18n.global.t('PROMPT.COLL_NORMAL_CONVERT_IMAGES')
                        );
                } else promtAnswer = false;

                if (promtAnswer) {
                    if (!this.collection?.loaded) {
                        await this.collection?.initLoadCollection();
                    }
                    storeProgressBar.init(this.collection!.arr.length);

                    for (const image of this.collection!.arr) {
                        await this.collection?.updateImage(image as any, { corrupt: true });
                        storeProgressBar.increment();
                    }

                    storeProgressBar.close();
                }

                this.close();
                storeNotification.notify(i18n.global.t('NOTIFICATION.MESSAGE.COLLECTION_INFO_UPDATED'));
            } catch (err) {
                console.log(err);
                storeNotification.notify(i18n.global.t('NOTIFICATION.MESSAGE.ERROR'), false);
            }
        },
    },
});
