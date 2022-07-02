import { computed, Ref, ref } from "vue";


export default function() {
    /**
     * Изображения
     */
    const images = ref<Array<ImageSingle | ImageSet>>([]);

    /**
     * Теги, введенные пользователем.
     */
    let tagsRef = ref<Array<string>>([]);

    /**
     * ComputedRef с изображениями, содержащими введенные пользователем теги.
     */
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

    /**
     * Инициализация изображений.
     * @param imagesArr Ref на массив с изображениями.
     */
    function setImages(imagesArr: Ref<Array<ImageSingle | ImageSet>>) {
        images.value = imagesArr.value;
    }

    /**
     * Инициализация тегов.
     * @param tags Ref на массив с тегами.
     */
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