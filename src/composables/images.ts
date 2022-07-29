import { computed, Ref, ref } from "vue";

export default function () {
    /**
     * Изображения
     */
    const images = ref<Array<ImageSingle | ImageSet>>([]);

    /**
     * Теги, введенные пользователем.
     */
    let tagsRef = ref<Array<string>>([]);

    /**
     * ComputedRef с изображениями, соответствующими запросу пользователя.
     */
    const filteredImages = computed(() => {
        if (tagsRef.value.length == 0) return images.value;
        return images.value!.filter((image) => {

            /**
             * Проверка каждого изображения в сете на наличие требуемых тегов.
             * Если хотя бы 1 изображение в сете соответствует требованиям,
             * то сет отображается.
             */
            if ("arr" in image) {
                let includes = false;
                imageLoop:
                for (const t of image.arr) {
                    for (const tag of tagsRef.value) {
                        const a = /!.+/.test(tag);

                        //Если тег начинается с ! и изображение содержит этот тег,
                        //то весь сет не подходит под запрос.
                        if (a && t.manifest.tags.includes(tag.replace("!", ""))) {
                            includes = false;
                            break imageLoop;
                        }

                        //Если тег не начинается с ! и изображение не содержит этот тег,
                        //то изображение не подходит под запрос.
                        if (!a && !t.manifest.tags.includes(tag)) {
                            continue imageLoop;
                        }
                    }

                    includes = true;
                    //break imageLoop;
                }

                return includes;
            }

            for (const tag of tagsRef.value) {
                const a = /!.+/.test(tag);

                //Если тег начинается с ! и изображение содержит этот тег,
                //то изображение не подходит под запрос.
                if (a && image.manifest.tags.includes(tag.replace("!", ""))) return false;

                //Если тег не начинается с ! и изображение не содержит этот тег,
                //то изображение не подходит под запрос.
                if (!a && !image.manifest.tags.includes(tag)) return false;
            }

            return true;
        });
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
        setTagRef,
    };
}
