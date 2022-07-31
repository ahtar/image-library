<template>
    <modal-dark @close="store.cancelUpdate" data-test="form-edit-close">
        <div class="form-wrapper wrapper">
            <select-image id="select-image" :set="image.arr" @change="changeActiveImage" v-if="store.isSet"
                :draggable="true" @dragSort="dragSort" data-test="form-edit-select" />
            <div class="form-image-edit-wrapper">
                <input-text class="wrapper-section" v-model="fileUrl" :label="t('LABEL.URL')" :important="true"
                    :active="false" />
                <input-tags class="wrapper-section" :tags="computedTags" :definedTags="definedTags" @add="addTag"
                    @remove="removeTag" data-test="input-tags" />
                <div class="wrapper-section button-section">
                    <button-small v-if="store.isSet" class="button" @click="separateImage"
                        data-test="form-edit-remove-image">{{ t('BUTTON.SET_SEPARATE') }}</button-small>
                    <button-small @click="store.updateImage" data-test="form-edit-save">{{ t('BUTTON.SAVE') }}
                    </button-small>
                </div>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image class="image-edit" :active="true" :fileData="fielHandle" @paste="pasteHandler"
                data-test="form-edit-image" />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import InputTags from "@/components/InputTag.vue";
import InputText from "@/components/InputText.vue";
import InputImage from "@/components/InputImage.vue";
import SelectImage from "@/components/SelectImage.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";
import ModalDark from "@/components/ModalDark.vue";

import { useImageEditStore } from "@/store/forms/form-image-edit";

import useTagActions from "@/composables/tags";

import misc from "@/modules/misc";
export default defineComponent({
    components: {
        InputTags,
        InputText,
        InputImage,
        SelectImage,
        ButtonSmall,
        ModalDark,
    },
    setup(props) {
        const store = useImageEditStore();

        const { addTag, removeTag, setTagRef, definedTags } = useTagActions();
        const { t } = useI18n();

        const image = ref<any>(store.image);
        const fielHandle = ref<FileSystemFileHandle | File>();

        //Текущее активное изображение.
        //Все изменения происходят на нем.
        //Если основное изображение это ImageSet, то активным  будет 1 из элементов этого сета
        //Если основное изображение это ImageSingle, то оно и будет активным.
        const activeImage = ref<ImageSingle>();
        const activeImageIndex = ref(0);

        //Ссылка на активное изображение.
        const fileUrl = computed(() => {
            return activeImage.value?.manifest.fileUrl || "";
        });

        //Теги активного изображения.
        const computedTags = computed(() => {
            return activeImage.value?.manifest.tags || [];
        });

        //Инициализация активного изображения, прорисовка изображения.
        onMounted(async () => {
            if (image.value != null) {
                if ("arr" in image.value) {
                    activeImage.value = image.value.arr[0];
                } else {
                    activeImage.value = image.value;
                }
                setTagRef(ref(activeImage.value!.manifest.tags));
                fielHandle.value = await activeImage.value?.getImage();
            }
        });

        //Смена активного изображения.
        async function changeActiveImage(image: ImageSingle, index: number) {
            if (image) {
                activeImageIndex.value = index;
                activeImage.value = image;
                setTagRef(ref(activeImage.value.manifest.tags));
                fielHandle.value = await activeImage.value?.getImage();
            }
        }

        //Изменение порядка изображений в сете.
        function dragSort(obj: any) {
            if (store.image) {
                if ("arr" in store.image) {
                    store.image.arr = misc.arrayChangePosition(
                        store.image.arr,
                        obj.fromIndex,
                        obj.toIndex
                    );
                }
            }
        }

        //Отделение изображения из сета.
        async function separateImage() {
            if (image.value) {
                document
                    .getElementById(`${activeImageIndex.value}`)
                    ?.children[0]?.classList.toggle("removed");
                store.separateImage(activeImage.value! as any);
            }
        }

        async function pasteHandler(data: File) {
            store.changeImageFile(activeImage.value!, data);
            fielHandle.value = data;
        }

        return {
            store,
            image,
            fielHandle,
            activeImage,
            changeActiveImage,
            fileUrl,
            definedTags,
            addTag,
            removeTag,
            computedTags,
            dragSort,
            separateImage,
            pasteHandler,
            t
        };
    },
});
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
    flex-direction: column;
    width: 30vw;

    .section {
        display: flex;
        align-items: center;
    }

    .wrapper-section {
        margin: max(7px, 2%);
    }

    .button-section {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
}

.form-wrapper {
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
