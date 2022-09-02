<template>
    <modal-dark @close="store.close" data-test="modal">
        <div class="form-image-create-wrapper wrapper" :class="{ 'margin-big': oldTagsCopy.length == 0 }"
            data-test="form-wrapper">
            <div class="prior-tag-wrapper" v-if="oldTagsCopy.length > 0" data-test="old-tags">
                <card-tag-small v-for="(tag, i) in oldTagsCopy" :key="i" :tag="tag" @click="reuseOldTag(i)" />
            </div>
            <div class="form-image-create" data-test="form-create-wrapper">
                <div class="section-wrapper">
                    <input-text v-model="store.form.fileUrl" :label="t('LABEL.ID')" :important="true"
                        :active="false" :placeholder="t('PLACEHOLDER.ID')" />
                </div>
                <input-tags class="section-wrapper" :tags="store.form.tags" :definedTags="definedTags" @add="addTag"
                    @remove="removeTag" data-test="input-tags" />
                <div class="buttons section-wrapper">
                    <button-small @click="store.clearForm" data-test="form-clear">{{ t('BUTTON.CLEAR') }}</button-small>
                    <button-small @click="store.submitImage" :blocked="saveButtonBlocked" data-test="form-save">
                        {{ t('BUTTON.SAVE') }}</button-small>
                </div>
                <div class="similar-images section-wrapper" v-if="haveDoubles">
                    <card-image-small v-for="image in doublicateImages" :image="image" :key="image.manifest.id"
                        class="image-card" />
                </div>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image :active="true" :fileData="store.form.file" @paste="imagePasteEvent" data-test="input-image" />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import jimp from "@/modules/jimp";

import ModalDark from "@/components/ModalDark.vue";
import InputText from "@/components/InputText.vue";
import InputTags from "@/components/InputTag.vue";
import InputImage from "@/components/InputImage.vue";
import CardImageSmall from "@/components/CardImageSmall.vue";
import CardTagSmall from "@/components/CardTagSmall.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";

import { useImageCreateStore } from "@/store/forms/form-create-image";

import useTagActions from "@/composables/tags";
import useDublicateImages from "@/composables/dublicate-images";

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
            type: Array as PropType<Array<Tag>>,
        },
        priorTags: {
            default: () => [],
            type: Array as PropType<Array<Tag>>,
        },
    },
    setup(props) {
        const store = useImageCreateStore();

        const { addTag, removeTag, setTagRef } = useTagActions();
        const { doublicateImages, setHash, haveDoubles } = useDublicateImages();
        const { t } = useI18n();

        const saveButtonBlocked = computed(() => {
            if (store.form.file == null) return true;
            return false;
        });

        //Предложенные теги, использованные в создании предыдущего изображения.
        const oldTagsCopy = computed(() => {
            return props.priorTags.filter((t) => !store.form.tags.includes(t.name))
        });

        setTagRef(ref(store.form.tags));

        //Вставка изображения.
        async function imagePasteEvent(data: File) {
            store.form.file = data;
            store.urlInputActive = false;
            store.form.hash = await jimp.getHash(data);
            setHash(store.form.hash);
        }

        //Добавление тега через окно с прошлыми тегами.
        function reuseOldTag(i: number) {
            addTag(oldTagsCopy.value[i]);
        }

        return {
            store,
            addTag,
            removeTag,
            imagePasteEvent,
            doublicateImages,
            haveDoubles,
            saveButtonBlocked,
            oldTagsCopy,
            reuseOldTag,
            t
        };
    },
});
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
        overflow-wrap: break-word;
    }
}

.form-image-create {
    background-color: $color-dark-1;
    border: thin solid $color-border-dark-1;
    border-radius: $radius-big;
    @include z-depth();
    display: flex;
    flex-direction: column;
    margin-left: 1vw;
    width: 30vw;

    .section-wrapper {
        margin: max(7px, 2%);
    }

    .buttons {
        display: flex;
        justify-content: space-around;
        
        .button-small {
            flex-grow: 1;
            margin: 2px;
        }
    }

    .similar-images {
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
