<template>
    <modal-dark @close="store.close">
        <div class="content-wrapper" data-test="collection-create-wrapper">
            <input-text
                class="section"
                id="input-name"
                v-model="store.form.name"
                :label="t('LABEL.NAME')"
                :placeholder="t('PLACEHOLDER.NAME')"
                :important="true"
                data-test="collection-create-name"
            />
            <input-text
                class="section"
                id="input-theme"
                v-model="store.form.theme"
                :label="t('LABEL.THEME')"
                :placeholder="t('PLACEHOLDER.THEME')"
                data-test="collection-create-theme"
            />
            <input-text
                class="input-description section"
                id="input-desc"
                v-model="store.form.description"
                :label="t('LABEL.DESC')"
                :placeholder="t('PLACEHOLDER.DESC')"
                :textarea="true"
                data-test="collection-create-description"
            />
            <div class="section section-checkbox">
                <input-checkbox
                    v-model="store.form.options.corrupted"
                    :label="t('LABEL.CORR')"
                    v-tooltip.auto="t('TOOLTIP.CORRUPTED')"
                    data-test="collection-create-corrupted"
                />
            </div>
            <div class="section-button section">
                <button-small
                    id="form-save"
                    @click="store.createCollection"
                    :blocked="saveButtonActive"
                    data-test="collection-create-save"
                    >{{ t('BUTTON.SAVE') }}</button-small
                >
                <button-small
                    id="form-clear"
                    @click="store.clearForm"
                    data-test="collection-create-clear"
                >
                    {{ t('BUTTON.CLEAR') }}
                </button-small>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image
                :active="true"
                :acceptVideo="false"
                :fileData="store.form.file"
                @paste="imagePasteEvent"
                data-test="collection-create-image"
            />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ModalDark from '@/components/ModalDark.vue';
import InputText from '@/components/InputText.vue';
import InputImage from '@/components/InputImage.vue';
import InputCheckbox from '@/components/InputCheckbox.vue';
import ButtonSmall from '@/components/ButtonSmall.vue';

import { useCollectionCreateStore } from '@/store/forms/form-collection-create';

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
            return (
                store.form.name == '' ||
                store.form.name == undefined ||
                store.form.file == undefined
            );
        });

        async function imagePasteEvent(data: File) {
            if (!data.type.includes('image')) return;
            store.form.file = data;
        }

        return {
            store,
            imagePasteEvent,
            saveButtonActive,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.content-wrapper {
    width: 30vw;
    margin-left: 10vw;
    @include material(1);
    @include flex-column();

    .section-button {
        @include flex-space-around();

        .button-small {
            flex-grow: 1;
            margin: 2px;
        }
    }

    .section {
        margin: max(7px, 2%);
    }

    .input-description {
        height: 20vh;
    }

    .section-checkbox {
        display: flex;
    }
}

.image-wrapper {
    margin-right: 3vw;
    flex-grow: 1;
    @include flex-center();
}
</style>
