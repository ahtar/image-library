<template>
    <modal-dark @close="store.close">
        <div class="prompt-wrapper" data-test="message-prompt">
            {{ store.message }}
            <div class="button-box">
                <button-small @click="store.close">{{t('BUTTON.CANCEL')}}</button-small>
                <button-small @click="store.confirm">{{t('BUTTON.CONFIRM')}}</button-small>
            </div>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n'
import { usePromptStore } from "@/store/modals/modal-prompt";

import ModalDark from "@/components/ModalDark.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall,
    },
    setup() {
        const store = usePromptStore();
         const { t } = useI18n() 

        return {
            store,
            t
        };
    },
});
</script>

<style lang="scss" scoped>
.prompt-wrapper {
    color: $color-text-main;
    font-size: 1.5rem;
    background-color: $color-dark-2;
    border: thin solid $color-border-dark-2;
    padding: 15px;
    @include z-depth(2);

    .button-box {
        display: flex;
        width: 100%;
        margin-top: 10px;
        justify-content: center;

        .button-small {
            margin: max(7px, 2%);
        }
    }
}
</style>
