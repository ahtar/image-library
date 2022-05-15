import { useCollections } from '@/store/collections'
import { computed, Ref, ref } from "vue";


export default function() {
    const collectionsStore = useCollections();

    const images = ref(collectionsStore.activeCollection!.arr);

    function filteredImages(tags: Ref<Array<string>>) {
        return computed(() => {
            return images.value?.filter((image) => {
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
    }


    return {
        images,
        filteredImages,
    }
}