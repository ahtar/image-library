import { useCollections } from '@/store/collections'
import { computed, ComputedRef, Ref, ref } from "vue";


export default function() {
    const collectionsStore = useCollections();

    //Compile error
    //Types of property 'collectionHandle' are incompatible
    //Property '[Symbol.asyncIterator]' is missing in type 'FileSystemDirectoryHandle' but required in type 'FileSystemDirectoryHandle'
    //????????????
    //Все Изображения в Коллекции.
    const images: Ref<Array<ImageSingle | ImageSet>> = ref(collectionsStore.activeCollection!.arr as Array<any>);

    //ИЗображения, отображаемые на экране с использованием IntersectionObserver.
    const displayedImages = ref<Array<ImageSingle | ImageSet>>([]);

    //Фильтрованные изображения.
    let fImages: ComputedRef<Array<ImageSingle | ImageSet>>;

    function filteredImages(tags: Ref<Array<string>>) {
        fImages = computed(() => {
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
    }


    //Отобразить следующую партию Изображений.
    //Если фильтр не задан, то использовать все Изображения.
    function displayNextImages(count = 15) {

        if(fImages == undefined) {
            if(displayedImages.value.length >= images.value.length) return false;
            displayedImages.value.push(...images.value.slice(displayedImages.value.length, displayedImages.value.length + count));
        } else {
            if(displayedImages.value.length >= fImages.value.length) return false;
            const temp = fImages.value.slice(displayedImages.value.length, displayedImages.value.length + count);
            displayedImages.value.push(...temp);
        }

        return true;
    }

    function resetDisplayedImages(filtered = true) {
        if(filtered) {
            displayedImages.value = fImages.value.slice(0, 15);
        } else {
            displayedImages.value = [];
        }
    }



    return {
        images,
        filteredImages,
        displayedImages,
        displayNextImages,
        resetDisplayedImages,
    }
}