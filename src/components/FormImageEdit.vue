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
    emits: ['updateImage'],
    setup(props, { emit }) {
        const store = useImageEditStore();
        const storeCollections = useCollections();

        const { addTag, removeTag, setTagRef, definedTags } = useTagActions();
        const { renderImage } = useRerenderImage();

        //Ref на img.
        const img = ref<null | HTMLImageElement>(null);
        const image = ref<any>(store.image);

        //Текущее активное изображение.
        //Все изменения происходят на нем.
        //Если основное изображение это ImageSet, то активным изображением будет 1 из элементов этого сета
        //Если основное изображение это ImageSingle, то оно и будет активным.
        const activeImage = ref<ImageSingle | null>(null);

        //Ссылка на активное изображение.
        const fileUrl = computed(() => {
            return activeImage.value?.manifest.fileUrl || ''
        });

        //Теги активного изображения.
        const computedTags = computed(() => {
            return activeImage.value?.manifest.tags || []
        })

        //Инициализация активного изображения, прорисовка изображения.
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

        //Смена активного изображения.
        async function changeActiveImage(image: ImageSingle) {
            activeImage.value = image;
            setTagRef(ref(activeImage.value.manifest.tags));
            renderImage(img.value!, await activeImage.value.getImage());
        }

        //Является ли основное изображение ImageSet.
        function isSet() {
            if(image.value != null) {
                if('arr' in image.value) {
                    return true;
                }
            }
            return false;
        }

        //Изменение порядка изображений в сете.
        function dragSort(obj: any) {
            if(store.image) {
                if('arr' in store.image) {
                    store.image.manifest.set = misc.arrayChangePosition(store.image.manifest.set, obj.fromIndex, obj.toIndex);
                    store.image.arr = misc.arrayChangePosition(store.image.arr, obj.fromIndex, obj.toIndex);
                }
            }
        }


        //Отделение изображения из сета.
        async function separateImage() {
            if(image.value != null) {
                console.log(activeImage.value);
                if('arr' in image.value) {
                    const img: ImageSet = image.value;
                    //Удаление ImageSingle из сета.
                    image.value.removeImage(activeImage.value!);
                    //Сохранение манифеста ImageSingle отдельным файлом.
                    storeCollections.activeCollection?.updateImage(activeImage.value! as any);
                    //Добавление ImageSingle в массив с изображениями.
                    storeCollections.activeCollection?.addImage(activeImage.value! as any);
                    //Изменение активного изображения на персове изображение в сете.
                    changeActiveImage(image.value.arr[0]);
                    //Если после удаления изображения из сета в сете останется лишь 1 изображение,
                    //то сохранить его как отдельное изображение и удалить сет.
                    if(image.value.arr.length == 1) {
                        //Удалить ImageSingle из сета.
                        image.value.removeImage(activeImage.value!);
                        //Удалить пустой сет.
                        await storeCollections.activeCollection?.deleteImage(image.value);
                        //Сохранение манифеста ImageSingle отдельным файлом.
                        await storeCollections.activeCollection?.updateImage(activeImage.value! as any);
                        //Добавление ImageSingle в массив с изображениями.
                        await storeCollections.activeCollection?.addImage(activeImage.value! as any);

                        store.close();

                    }
                }
            }
        }

        return {
            close() {
                store.close();
                //store.updateImage();
                emit('updateImage', store.image);
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