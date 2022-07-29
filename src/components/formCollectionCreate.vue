<template>
    <modal-dark @close="store.close">
        <div class="content-wrapper" data-test="collection-create-wrapper">
            <input-text class="section-wrapper" id="input-name" v-model="store.form.name" :label="t('LABEL.NAME')"
                :placeholder="t('PLACEHOLDER.NAME')" :important="true" data-test="collection-create-name" />
            <input-text class="section-wrapper" id="input-theme" v-model="store.form.theme" :label="t('LABEL.THEME')"
                :placeholder="t('PLACEHOLDER.THEME')" data-test="collection-create-theme" />
            <input-text class="input-description section-wrapper" id="input-desc" v-model="store.form.description"
                :label="t('LABEL.DESC')" :placeholder="t('PLACEHOLDER.DESC')" :textarea="true"
                data-test="collection-create-description" />
            <div class="section-wrapper checkbox-wrapper">
                <input-checkbox v-model="store.form.options.corrupted" :label="t('LABEL.CORR')"
                    data-test="collection-create-corrupted" />
            </div>
            <div class="button-wrapper section-wrapper">
                <button-small id="form-save" @click="store.createCollection" :blocked="saveButtonActive"
                    data-test="collection-create-save">{{ t('BUTTON.SAVE') }}</button-small>
                <button-small id="form-clear" @click="store.clearForm" data-test="collection-create-clear">
                    {{ t('BUTTON.CLEAR') }}
                </button-small>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image :active="true" :blob="store.form.blob" @paste="imagePasteEvent"
                data-test="collection-create-image" />
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

import { useCollectionCreateStore } from "@/store/forms/form-collection-create";

export default defineComponent({
    components: {
        ModalDark,
        InputText,
        InputImage,
        InputCheckbox,
        ButtonSmall,
    },
    setup() {
        const store = useCollectionCreateStore();
        const { t } = useI18n();

        const saveButtonActive = computed(() => {
            return ((store.form.name == "" || store.form.name == undefined) || (store.form.blob == undefined));
        });

        async function imagePasteEvent(data: Blob) {
            store.form.blob = data;
        }

        return {
            store,
            imagePasteEvent,
            saveButtonActive,
            t
        };
    },
});
</script>

<style lang="scss" scoped>
.content-wrapper {
    width: 30vw;
    margin-left: 10vw;
    background-color: $color-dark-1;
    border: thin solid $color-border-dark-1;
    border-radius: $radius-big;
    @include z-depth();
    display: flex;
    flex-direction: column;

    .button-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .section-wrapper {
        margin: max(7px, 2%);
    }

    .input-description {
        height: 20vh;
    }

    .checkbox-wrapper {
        display: flex;
    }
}

.form-wraper {
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
