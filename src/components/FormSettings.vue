<template>
    <modal-dark @close="close" data-test="form-settings">
        <div class="form-settings-wrapper">
            <input-checkbox data-test="tooltips-checkbox" v-model="store.showTooltips"
                :label="t('LABEL.SHOW_TOOLTIPS')" />
            <input-checkbox data-test="card-animations-checkbox" v-model="store.showCardAnimations"
                :label="t('LABEL.SHOW_CARD_ANIMATIONS')" />
            <input-checkbox data-test="collection-slide-bar" v-model="store.collectionUseSlideSidebar"
                :label="t('LABEL.SLIDE_SIDEBAR')" />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ModalDark from './ModalDark.vue';
import InputCheckbox from './InputCheckbox.vue';

import { useSettings } from '@/store/settings';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    components: {
        ModalDark,
        InputCheckbox,
    },
    setup() {
        const store = useSettings();
        const { t } = useI18n();

        function close() {
            store.visible = false;
        }

        return {
            store,
            close,
            t,
        };
    },
});
</script>

<style lang="scss" scope>
.form-settings-wrapper {
    padding: 1.5vh;
    align-items: flex-start;
    @include material(1);
    @include flex-column();

    .input-checkbox-wrapper {
        margin: 1vh;
    }
}
</style>
