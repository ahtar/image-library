<template>
    <modal-dark @close="store.close" data-test="modal">
        <div class="form-image-create-wrapper wrapper" :class="{ 'margin-big': oldTagsCopy.length == 0 }" data-test="form-wrapper">
            <div class="prior-tag-wrapper" v-if="oldTagsCopy.length > 0" data-test="old-tags">
                <card-tag-small v-for="(tag, i) in oldTagsCopy" :key="i" :tag="tag" @click="reuseOldTag(i)"/>
            </div>
            <div class="form-image-create" data-test="form-create-wrapper">
                <div class="section">
                    <input-text v-model="store.form.fileUrl" label="Id" :important="true" :active="store.urlInputActive" placeholder="Идентификатор изображения"/>
                </div>
                <input-tags :tags="store.form.tags" :definedTags="definedTags" @add="addTag" @remove="removeTagHandler" data-test="input-tags"/>
                <div class="buttons">
                    <button-small @click="store.clearForm" data-test="form-clear">Отчистить</button-small>
                    <button-small @click="store.submitImage" :blocked="saveButtonBlocked" data-test="form-save">Сохранить</button-small>
                </div>
                <div class="similar-images" v-if="haveDoubles">
                    <card-image-small v-for="(image) in doublicateImages" :image="image" :key="image.manifest.id" class="image-card"/>
                </div>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image :active="true" :blob="store.form.blob" @paste="imagePasteEvent" data-test="input-image"/>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref } from 'vue'
import jimp from '@/modules/jimp'

import ModalDark from '@/components/ModalDark.vue'
import InputText from '@/components/InputText.vue'
import InputTags from '@/components/InputTag.vue'
import InputImage from '@/components/InputImage.vue'
import CardImageSmall from '@/components/CardImageSmall.vue'
import CardTagSmall from '@/components/CardTagSmall.vue'
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
        CardImageSmall,
        CardTagSmall,
    },
    props: {
        definedTags: {
            required: true,
            type: Array as PropType<Array<Tag>>
        },
        priorTags: {
            default: () => [],
            type: Array as PropType<Array<Tag>>
        }
    },
    setup(props) {
        const store = useImageCreateStore();

        const { addTag, removeTag, setTagRef } = useTagActions();
        const { doublicateImages, setHash, haveDoubles } = useDublicateImages();

        const saveButtonBlocked = computed(() => {
            if(store.form.blob == null) return true;
            return false;
        });

        //Теги прошлого созданного изображения.
        const oldTagsCopy: Ref<Tag[]> = ref(props.priorTags.filter(t => !store.form.tags.includes(t.name)));

        setTagRef(ref(store.form.tags));

        async function imagePasteEvent(data: Blob) {
            store.form.blob = data;
            store.urlInputActive = false;
            store.form.hash = await jimp.getHash(data);
            setHash(store.form.hash);
        }

        function reuseOldTag(i: number) {
            addTag(oldTagsCopy.value[i]);
            oldTagsCopy.value.splice(i, 1);
        }

        function removeTagHandler(tag: Tag | string, index: number) {
            removeTag(tag, index);

            //Возвращает удаленный тег в массив с тегами из прошлого изображения.
            if(typeof tag == 'string') {
                const t = props.priorTags.find((t) => t.name == tag);
                if(t && !oldTagsCopy.value.includes(t)) {
                    oldTagsCopy.value.push(t);
                }
            }
        }


        return {
            store,
            addTag,
            removeTagHandler,
            imagePasteEvent,
            doublicateImages,
            haveDoubles,
            saveButtonBlocked,
            oldTagsCopy,
            reuseOldTag,
        }
    },
})
</script>


<style lang="scss" scoped>

    .form-image-create-wrapper {
        margin-left: 5vw;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .margin-big {
        margin-left: calc(12vw + 26px);
    }

    .prior-tag-wrapper {
        width: 7vw;
        max-height: 60vh;
        background-color: $color-dark-1;
        border: thin solid $color-border-dark-1;
        border-radius: $radius-big;
        padding: 12px;
        overflow-y: auto;
        @include z-depth();
        @include scroll();
        
        .card-tag-small {
            margin-bottom: 12px;
        }
    }
    .form-image-create {
        background-color: $color-dark-1;
        border: thin solid $color-border-dark-1;
        border-radius: $radius-big;
        @include z-depth();
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        padding: 20px;
        margin-left: 1vw;
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

    .image-wrapper {
        margin-right: 3vw;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>