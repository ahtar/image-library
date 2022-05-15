<template>
    <modal-dark @close="close">
        <div class="section-wrapper wrapper">
            <select-image :set="image.arr" @change="changeActiveImage" v-if="isSet()" :draggable="true" @dragSort="dragSort"/>
            <div class="form-image-edit-wrapper">
                <input-text v-model="fileUrl" label="Ссылка" :important="true" :active="false"/>
                <input-tags :tags="computedTags" :definedTags="definedTags" @add="addTag" @remove="removeTag"/>
                <button-small v-if="isSet()" class="button" @click="separateImage">Remove image from set</button-small>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <img  class="image-edit" ref="img"/>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

import InputTags from '@/components/InputTag.vue'
import InputText from '@/components/InputText.vue'
import SelectImage from '@/components/SelectImage.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'
import ModalDark from '@/components/ModalDark.vue'

import { useImageEditStore } from '@/store/forms/form-image-edit'
import { useCollections } from '@/store/collections'

import useTagActions from '@/composables/tags'
import useRerenderImage from '@/composables/image-rendering'

import misc from '@/modules/misc'

export default defineComponent({
    components: {
        InputTags,
        InputText,
        SelectImage,
        ButtonSmall,
        ModalDark,
    },
    setup() {
        const store = useImageEditStore();
        const storeCollections = useCollections();

        const { addTag, removeTag, setTagRef, definedTags, tagsOnChange } = useTagActions();
        const { renderImage } = useRerenderImage();

        const img = ref<null | HTMLImageElement>(null);
        const image = ref<any>(store.image);
        const activeImage = ref<ImageSingle | null>(null);

        const fileUrl = computed(() => {
            return activeImage.value?.manifest.fileUrl || ''
        });

        const computedTags = computed(() => {
            return activeImage.value?.manifest.tags || []
        })


        onMounted(async () => {
            if(image.value != null) {
                if('arr' in image.value) {
                    activeImage.value = image.value.arr[0];
                } else {
                    activeImage.value = image.value;
                }
                setTagRef(ref(activeImage.value!.manifest.tags));
                renderImage(img.value!, await activeImage.value!.getImage());
            }
        });

        async function changeActiveImage(image: ImageSingle) {
            activeImage.value = image;
            setTagRef(ref(activeImage.value.manifest.tags));
            renderImage(img.value!, await activeImage.value.getImage());
        }

        tagsOnChange((value, oldValue) => {
            //Add tag
            if(value.length > oldValue.length) {
                const data: Tag = (value.filter((x: any) => !oldValue.includes(x)).concat(oldValue.filter((x: any) => !value.includes(x))));
                
            } else {
                //Remove tag
                const data: Tag = (oldValue.filter((x: any) => !value.includes(x)).concat(value.filter((x: any) => !oldValue.includes(x))));
                
            }
        });

        function isSet() {
            if(image.value != null) {
                if('arr' in image.value) {
                    return true;
                }
            }
            return false;
        }

        function dragSort(obj: any) {
            if(store.image) {
                if('arr' in store.image) {
                    store.image.manifest.set = misc.arrayChangePosition(store.image.manifest.set, obj.fromIndex, obj.toIndex);
                    store.image.arr = misc.arrayChangePosition(store.image.arr, obj.fromIndex, obj.toIndex);
                }
            }
        }

        /**
         * Separate image from set
         */
        async function separateImage() {
            if(image.value != null) {
                console.log(activeImage.value);
                if('arr' in image.value) {
                    const img: ImageSet = image.value;
                    //Remove image from set.
                    image.value.removeImage(activeImage.value!);
                    //Save image manifest as separate file.
                    storeCollections.activeCollection?.updateImage(activeImage.value! as any);
                    //Add image to collection array.
                    storeCollections.activeCollection?.addImage(activeImage.value! as any);
                    //Change active image to the first image of array.
                    changeActiveImage(image.value.arr[0]);
                    //Remove last image from set and delete set.
                    if(image.value.arr.length == 1) {
                        //Remove image from set.
                        image.value.removeImage(activeImage.value!);
                        //Delete empty image set.
                        await storeCollections.activeCollection?.deleteImage(image.value);
                        //Save image manifest as separate file.
                        await storeCollections.activeCollection?.updateImage(activeImage.value! as any);
                        //Add image to collection array.
                        await storeCollections.activeCollection?.addImage(activeImage.value! as any);

                        store.close();

                    }
                }
            }
        }

        return {
            close() {
                store.close();
                store.updateImage();
            },
            img,
            image,
            activeImage,
            changeActiveImage,
            fileUrl,
            definedTags,
            addTag,
            removeTag,
            isSet,
            computedTags,
            dragSort,
            separateImage,
        }
    },
})
</script>


<style lang="scss" scoped>
    .modal-dark {
        justify-content: center;
    }
    .form-image-edit-wrapper {
        margin-left: 1vw;
        background-color: $color-dark-1;
        border: thin solid $color-border-dark-1;
        border-radius: $radius-big;
        @include z-depth();
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        padding: 20px;
        width: 30vw;

        .section {
            display: flex;
            align-items: center;
        }
    }

    .button {
        margin-top: 5%;
    }

    .section-wrapper {
        margin-left: 3vw;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 45%;
    }

    .image-wrapper {
        margin-right: 3vw;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image-edit {
        max-height: 95vh;
        max-width: 50vw;
        margin-left: 70px;
    }
</style>