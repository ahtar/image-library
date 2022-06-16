import { computed, ComputedRef, Ref, ref, watch } from "vue";
import { useCollections } from '@/store/collections'


export default function() {
    const storeCollections = useCollections();

    //Types of property 'collectionHandle' are incompatible
    //Property '[Symbol.asyncIterator]' is missing in type 'FileSystemDirectoryHandle' but required in type 'FileSystemDirectoryHandle'
    //????????????
    /**
     * Изображения в коллекции.
     * Изначально берутся из активной коллекции.
     * Свои изображения можно задать с помощью setImages.
     */
    //const images = ref<Array<ImageSingle | ImageSet>>([]);

    //Ref, определяющий, были ли заданы свои изображения с помозью setImages.
    //const customImages = ref(false);


    //let tagsRef = ref<Array<string>>([]);

    //Инициализация изображений и реагирование на изменение активной коллекции.
    //if(storeCollections.activeCollection) images.value = storeCollections.activeCollection.arr as any;
    //watch(() => storeCollections.activeCollection, () => {
    //    if(!customImages.value && storeCollections.activeCollection) {
    //        images.value = storeCollections.activeCollection.arr as any;
    //    }
    //});


    /**
     * Изображения, соответствующие заданных тегам.
     * Теги задаются с помощью filteredImages.
     */
    //let fImages: ComputedRef<Array<ImageSingle | ImageSet>>;

    /**
     * Установка изображений.
     * @param imagesArr Массив с изображениями.
     */
    //function setImages(imagesArr: Array<ImageSingle | ImageSet>) {
    //    images.value = imagesArr;
    //    customImages.value = true;
    //}

    /**
     * Задание тегов для фильтрации и получение фильтрованых изображений.
     * @param tags Массив с тегами.
     * @returns Фильтрованные изображения.
     */
    /*function filteredImages(tags: Ref<Array<string>>) {
        tagsRef = tags;
        fImages = computed<any>(() => {
            return images.value!.filter((image) => {
                if('set' in image.manifest) {
                    //работает криво
                    //должен вернуть true если хоть в 1 изображении в сете есть нужный тег
                    //а сейчас только если во всех изображениях есть нужный тег
                    for(const t of (image as ImageSet).arr) {
                        for(let i = 0; i < tags.value.length; i++) {
                            const tag = tags.value[i];
                            if(!t.manifest.tags.includes(tag)) {
                                return false;
                            }
                        }
                    }
                } else {
                    for(let i = 0; i < tags.value.length; i++) {
                        const tag = tags.value[i];
                        if(/!.+/.test(tag)) {
                            if(image.manifest.tags.includes(tag.replace('!', ''))) {
                                return false;
                            }
                        } else {
                            if(!image.manifest.tags.includes(tag)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });
        });
        return fImages;
    }*/




    /**
     * Изображения, отображаемые на экране с использованием IntersectionObserver.
     * Для добавления изображений используется displayNextImages.
     * Для сброса изображений используется resetDisplayedImages.
     * Для реагирования на удаление или создание изображений используются displayAddImage и displayDeleteImage.
     */
    //const displayedImages = ref<Array<ImageSingle | ImageSet>>([]);


    /**
     * Отобразить следующую партию Изображений.
     * Если фильтр не задан, то использовать все Изображения.
     * @param count Количество добавляемых изображений.
     * @returns статус операции.
     */
    /*function displayNextImages(count = 15) {

        if(fImages == undefined) {
            if(displayedImages.value.length >= images.value!.length) return false;
            displayedImages.value.push(...images.value!.slice(displayedImages.value.length, displayedImages.value.length + count));
        } else {
            if(displayedImages.value.length >= fImages.value.length) return false;
            const temp = fImages.value.slice(displayedImages.value.length, displayedImages.value.length + count);
            displayedImages.value.push(...temp);
        }

        return true;
    }*/

    //Сбросить отображаемые изображения.
    /*function resetDisplayedImages(filtered = true) {
        if(filtered) {
            displayedImages.value = fImages.value.slice(0, 15);
        } else {
            displayedImages.value = [];
        }
    }*/

    /**
     * Добавляние нового изображения в массив с отображаемыми изображениями, если оно соответствует фильтру.
     * @param image Добавляемое изображение.
     */
    /*function displayAddImage(image: ImageSingle | ImageSet) {
        for(const tag of tagsRef.value) {
            if('arr' in image) {
                for(const img of image.manifest.set) {
                    if(!img.tags.includes(tag)) {
                        return
                    }
                }
            } else {
                if(!image.manifest.tags.includes(tag)) {
                    return;
                }
            }
        }

        displayedImages.value.unshift(image);
        console.log('composable add image');
    }*/

    /**
     * Удаление изображения из массива с отображаемыми изображениями.
     * @param image Удалённое изображение.
     */
    /*function displayDeleteImage(image: ImageSingle | ImageSet) {
        const index = displayedImages.value.findIndex(img => img == image);
        if(index != -1) displayedImages.value.splice(index, 1);
        console.log('composalbe delete image');
    }*/


    //Все изображения
    const images = ref<Array<ImageSingle | ImageSet>>([]);

    //Теги, запрошенные пользователем.
    let tagsRef = ref<Array<string>>([]);

    //Изображения, имеющие запрошенные теги.
    const filteredImages = computed(() => {
        if(tagsRef.value.length == 0) return images.value;
        else {
            return images.value!.filter((image) => {
                if('set' in image.manifest) {
                    //работает криво
                    //должен вернуть true если хоть в 1 изображении в сете есть нужный тег
                    //а сейчас только если во всех изображениях есть нужный тег
                    for(const t of (image as ImageSet).arr) {
                        for(let i = 0; i < tagsRef.value.length; i++) {
                            const tag = tagsRef.value[i];
                            if(!t.manifest.tags.includes(tag)) {
                                return false;
                            }
                        }
                    }
                } else {
                    for(let i = 0; i < tagsRef.value.length; i++) {
                        const tag = tagsRef.value[i];
                        if(/!.+/.test(tag)) {
                            if(image.manifest.tags.includes(tag.replace('!', ''))) {
                                return false;
                            }
                        } else {
                            if(!image.manifest.tags.includes(tag)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });
        }
    });

    //Инициализировать изображения.
    function setImages(imagesArr: Ref<Array<ImageSingle | ImageSet>>) {
        images.value = imagesArr.value;
    }

    //Инициализировать теги.
    function setTagRef(tags: Ref<Array<string>>) {
        tagsRef = tags;
    }



    return {
        images,
        setImages,
        filteredImages,
        setTagRef
    }
}