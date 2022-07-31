<template>
    <modal-dark @close="store.close" data-test="modal">
        <div class="content-wrapper" data-test="collection-edit-wrapper">
            <input-text class="wrapper-section" :label="t('LABEL.NAME')" :placeholder="t('PLACEHOLDER.NAME')"
                :important="true" v-model="data.name" data-test="collection-edit-name" />
            <input-text class="wrapper-section" :label="t('LABEL.THEME')" :placeholder="t('PLACEHOLDER.THEME')"
                v-model="data.theme" data-test="collection-edit-theme" />
            <input-text class="wrapper-section input-description" :label="t('LABEL.DESC')"
                :placeholder="t('PLACEHOLDER.DESC')" v-model="data.description" :textarea="true"
                data-test="collection-edit-description" />
            <div class="wrapper-section section-checkbox">
                <input-checkbox v-model="store.form.options.corrupted" :label="t('LABEL.CORR')"
                    data-test="collection-edit-corrupted" />
            </div>
            <div class="wrapper-section button-container">
                <button-small @click="store.save" :blocked="!buttonSaveActive" data-test="collection-edit-save">
                    {{ t('BUTTON.SAVE') }}
                </button-small>
            </div>
        </div>

        <div class="image-wrapper wrapper">
            <input-image :active="true" :fileData="data.file!" @paste="imagePasteEvent" data-test="collection-edit-image" />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

import ModalDark from "@/components/ModalDark.vue";
import InputText from "@/components/InputText.vue";
import InputImage from "@/components/InputImage.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";

import { useCollectionEditStore } from "@/store/forms/form-collection-edit";

export default defineComponent({
    components: {
        ModalDark,
        InputText,
        InputImage,
        InputCheckbox,
        ButtonSmall,
    },
    setup() {
        const store = useCollectionEditStore();
        const { t } = useI18n();

        const buttonSaveActive = computed(() => {
            return store.form.name != "";
        });

        async function imagePasteEvent(data: File) {
            store.form.file = data;
        }

        return {
            store,
            data: store.form,
            imagePasteEvent,
            buttonSaveActive,
            t
        };
    },
});
</script>

<style lang="scss" scoped>
.content-wrapper {
    width: 30vw;
    height: fit-content;
    margin-left: 10vw;
    background-color: $color-dark-1;
    border: thin solid $color-border-dark-1;
    border-radius: $radius-big;
    @include z-depth();
    display: flex;
    flex-direction: column;

    .input-description {
        height: 20vh;
    }

    .wrapper-section {
        margin: max(7px, 2%);
    }

    .section-checkbox {
        display: flex;
    }

    .button-container {
        display: flex;
        flex-direction: row;
        width: 96%;
        justify-content: space-around;
    }
}

.image-wrapper {
    margin-right: 3vw;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button-small {
    margin: 2%;
}
</style>
