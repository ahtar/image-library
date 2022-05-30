<template>
    <modal-dark @close="store.close" data-test="modal">
        <div class="form-image-create-wraper wraper" data-test="form-wrapper">
            <div class="form-image-create">
            <div class="section">
                <input-text v-model="store.form.fileUrl" label="Id" :important="true" :active="store.urlInputActive" placeholder="Идентификатор изображения"/>
            </div>
            <input-tags :tags="store.form.tags" :definedTags="definedTags" @add="addTag" @remove="removeTag" data-test="input-tags"/>
            <div class="buttons">
                <button-small @click="store.clearForm" data-test="form-clear">Отчистить</button-small>
                <button-small @click="saveImage" :blocked="saveButtonBlocked" data-test="form-save">Сохранить</button-small>
            </div>
            <div class="similar-images" v-if="haveDoubles">
                <card-image-small 
                        v-for="(image) in doublicateImages"
                        :image="image" 
                        :key="image.manifest.id"
                        class="image-card"
                />
            </div>
        </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image :active="true" :blob="store.form.blob" @paste="imagePasteEvent" data-test="input-image"/>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import jimp from '@/modules/jimp'

import ModalDark from '@/components/ModalDark.vue'
import InputText from '@/components/InputText.vue'
import InputTags from '@/components/InputTag.vue'
import InputImage from '@/components/InputImage.vue'
import CardImageSmall from '@/components/CardImageSmall.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'

import { useImageCreateStore } from '@/store/forms/form-create-image'

import useTagActions from '@/composables/tags'
import useDublicateImages from '@/composables/dublicate-images'
import { computed } from '@vue/reactivity'

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall,
        InputText,
        InputTags,
        InputImage,
        CardImageSmall
    },
    props: {
        definedTags: {
            required: true,
            type: Array as PropType<Array<Tag>>
        }
    },
    emits: ['saveImage'],
    setup(props, { emit }) {
        const store = useImageCreateStore();

        const { addTag, removeTag, setTagRef } = useTagActions();
        const { doublicateImages, setHash, haveDoubles } = useDublicateImages();

        const saveButtonBlocked = computed(() => {
            if(store.form.blob == null) return true;
            return false;
        });

        setTagRef(ref(store.form.tags));

        async function imagePasteEvent(data: Blob) {
            store.form.blob = data;
            store.urlInputActive = false;
            store.form.hash = await jimp.getHash(data);
            setHash(store.form.hash);
        }

        function saveImage() {
            const data = store.submitImage();
            emit('saveImage', data);
        }


        return {
            store,
            addTag,
            removeTag,
            imagePasteEvent,
            doublicateImages,
            haveDoubles,
            saveImage,
            saveButtonBlocked,
        }
    },
})
</script>


<style lang="scss" scoped>
    .form-image-create {
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
            width: 100%;

            .input-wrapper {
                width: 100%;
            }
        }

        .buttons {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .tag-input-wrapper {
            margin-bottom: 5%;
        }

        .similar-images {
            height: 260px;
            width: 100%;
            display: flex;
            overflow-x: auto;
            align-items: center;
            border: thin solid $color-border-dark-2;
            background-color: $color-dark-2;
            @include z-depth();
            @include scroll();

            .card-image-small {
                height: auto;
            }
        }
    }

    .input-image {
        margin-left: 10vw;
    }

    .form-image-create-wraper {
        margin-left: 10vw;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .image-wrapper {
        margin-right: 3vw;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>