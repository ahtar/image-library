import { useCollections } from '@/store/collections'
import { useNotificationStore } from '@/store/modals/modal-notification'
import { defineStore } from 'pinia'

export const useImageEditStore = defineStore('imageEdit', {
    state: () => {
        return {
            storeCollections: useCollections(),
            visible: false,
            image: null as ImageSingle | ImageSet | null,
        }
    },
    getters: {
        isSet: (state) => {
            if(state.image) {
                if('arr' in state.image) return true;
            }
            return false;
        },
    },
    actions: {


        setImage(image: ImageSingle | ImageSet | null) {
            this.image = image;
        },


        open() {
            this.visible = true;
        },


        close() {
            this.visible = false;
        },

        async updateImage() {
            const storeNotifications = useNotificationStore();
            if(this.image != undefined) {
                try {
                    await this.storeCollections.activeCollection?.updateImage(this.image as any);
                    storeNotifications.notify('Изображение измененно!');
                } catch(err) {
                    console.log(err);
                    storeNotifications.notify('Изображение не измененно, что-то пошло не так', false);
                }
            }
        },

        /*isSet() {
            if(this.image) {
                if('arr' in this.image) return true;
            }
            return false;
        },*/

        async separateImage(image: ImageSingle) {
            if(this.image) {
                if('arr' in this.image) {
                    //Удаление ImageSingle из сета.
                    this.image.removeImage(image);
                    //Сохранение данных ImageSingle отдельным файлом.
                    this.storeCollections.activeCollection!.updateImage(image);
                    //Добавление ImageSingle в массив с изображениями.
                    this.storeCollections.activeCollection!.addImage(image);

                    //Если после удаления изображения из сета в сете останется лишь 1 изображение,
                    //то сохранить его как отдельное изображение и удалить сет.
                    if(this.image.arr.length == 1) {
                        const lastImage = this.image.arr[0];
                        //Удалить ImageSingle из сета.
                        this.image.removeImage(lastImage as any);
                        //Удалить пустой сет.
                        await this.storeCollections.activeCollection!.deleteImage(lastImage as any);
                        //Сохранение манифеста ImageSingle отдельным файлом.
                        await this.storeCollections.activeCollection!.updateImage(lastImage as any);
                        //Добавление ImageSingle в массив с изображениями.
                        await this.storeCollections.activeCollection!.addImage(lastImage as any);

                        this.close();
                    }
                }
            }
        }
    }
});