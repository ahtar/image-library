<template>
    <modal-dark @close="close">
        <div class="form-settings-wrapper">
            <input-checkbox
                v-model="store.showTooltips"
                :label="t('LABEL.SHOW_TOOLTIPS')"
            />
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
    @include material(1);
}
</style>
