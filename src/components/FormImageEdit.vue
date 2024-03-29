<template>
    <modal-dark @close="store.cancelUpdate" data-test="form-edit-close">
        <div class="form-wrapper wrapper">
            <select-image
                id="select-image"
                :set="imageSetArray"
                @change="changeActiveImage"
                v-if="store.isSet"
                :draggable="true"
                @dragSort="dragSort"
                data-test="form-edit-select"
            />
            <div class="form-image-edit-wrapper">
                <input-text
                    class="section"
                    v-model="fileUrl"
                    :label="t('LABEL.URL')"
                    :important="true"
                    :active="false"
                />
                <input-tags
                    class="section"
                    :tags="computedTags"
                    :definedTags="definedTags"
                    @add="addTag"
                    @remove="removeTag"
                    data-test="input-tags"
                />
                <div class="section section-button">
                    <button-small
                        v-if="store.isSet"
                        class="button"
                        @click="separateImage"
                        v-tooltip.auto="t('TOOLTIP.SEPARATE_IMAGE')"
                        data-test="form-edit-remove-image"
                        >{{ t('BUTTON.SET_SEPARATE') }}</button-small
                    >
                    <button-small
                        class="button"
                        @click="store.updateImage"
                        data-test="form-edit-save"
                        v-tooltip.auto="t('TOOLTIP.SAVE_IMAGE_CHANGES')"
                        >{{ t('BUTTON.SAVE') }}
                    </button-small>
                </div>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image
                class="image-edit"
                :active="true"
                :fileData="fileHandle"
                @paste="pasteHandler"
                data-test="form-edit-image"
            />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import InputTags from '@/components/InputTag.vue';
import InputText from '@/components/InputText.vue';
import InputImage from '@/components/InputImage.vue';
import SelectImage from '@/components/SelectImage.vue';
import ButtonSmall from '@/components/ButtonSmall.vue';
import ModalDark from '@/components/ModalDark.vue';

import { useImageEditStore } from '@/store/forms/form-image-edit';

import useTagActions from '@/composables/tags';

import misc from '@/modules/misc';
export default defineComponent({
    components: {
        InputTags,
        InputText,
        InputImage,
        SelectImage,
        ButtonSmall,
        ModalDark,
    },
    setup() {
        const store = useImageEditStore();

        const { addTag, removeTag, setTagRef, definedTags } = useTagActions();
        const { t } = useI18n();

        const image = ref<ImageSet | ImageSingle | null>(store.image);
        const fileHandle = ref<FileSystemFileHandle | File | ImageSingle>();

        //Текущее активное изображение.
        //Все изменения происходят на нем.
        //Если основное изображение это ImageSet, то активным  будет 1 из элементов этого сета
        //Если основное изображение это ImageSingle, то оно и будет активным.
        const activeImage = ref<ImageSingle>();
        const activeImageIndex = ref(0);

        //Ссылка на активное изображение.
        const fileUrl = computed(() => {
            return activeImage.value?.getUrl()?.file || '';
        });

        //Теги активного изображения.
        const computedTags = computed(() => {
            return activeImage.value?.manifest.tags || [];
        });

        //Возвращает массив с изображениями сета, если image.value это сет
        //если image.value не сет, то возвращает пустой массив
        const imageSetArray = computed(() => {
            if (!image.value) return [];
            if ('arr' in image.value) {
                return image.value.arr;
            }
            return [];
        });

        //Инициализация активного изображения, прорисовка изображения.
        onMounted(async () => {
            if (image.value != null) {
                if ('arr' in image.value) {
                    activeImage.value = image.value.arr[0];
                } else {
                    activeImage.value = image.value;
                }
                setTagRef(ref(activeImage.value.manifest.tags));
                fileHandle.value = activeImage.value;
            }
        });

        //Смена активного изображения.
        async function changeActiveImage(image: ImageSingle, index: number) {
            if (image) {
                activeImageIndex.value = index;
                activeImage.value = image;
                setTagRef(ref(activeImage.value.manifest.tags));

                //Если файл был заменен, то отобразить замененный файл
                if (store.imageFileChanges[image.manifest.id]) {
                    fileHandle.value =
                        store.imageFileChanges[image.manifest.id];
                } else {
                    fileHandle.value = image;
                }
            }
        }

        //Изменение порядка изображений в сете.
        function dragSort(obj: { fromIndex: number; toIndex: number }) {
            if (store.image) {
                if ('arr' in store.image) {
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
            if (!activeImage.value) return;
            if (image.value) {
                document
                    .getElementById(`${activeImageIndex.value}`)
                    ?.children[0]?.classList.toggle('removed');
                store.separateImage(activeImage.value);
            }
        }

        async function pasteHandler(data: File) {
            if (!activeImage.value) return;
            store.changeImageFile(activeImage.value, data);
            fileHandle.value = data;
        }

        return {
            store,
            image,
            imageSetArray,
            fileHandle,
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
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.form-image-edit-wrapper {
    margin-left: 1vw;
    width: 30vw;
    @include material(1);
    @include flex-column();

    .section {
        margin: max(7px, 2%);
    }

    .section-button {
        @include flex-space-around();

        .button {
            flex-grow: 1;
            margin: 2px;
        }
    }
}

.form-wrapper {
    margin-left: 3vw;
    width: 45%;
    @include flex-center-vertical();
}

.image-wrapper {
    margin-right: 3vw;
    flex-grow: 1;
    @include flex-center();
}

.image-edit {
    max-height: 95vh;
    max-width: 50vw;
    margin-left: 70px;
}
</style>
