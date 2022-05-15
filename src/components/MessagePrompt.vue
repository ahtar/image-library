<template>
    <modal-dark @close="close">
        <div class="prompt-wrapper">
            {{store.message}}
            <div class="button-box">
                <button-small @click="close">Нет</button-small>
                <button-small @click="confirm">Да</button-small>
            </div>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { usePromptStore } from '@/store/modals/modal-prompt'

import ModalDark from '@/components/ModalDark.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall
    },
    setup() {
        const store = usePromptStore();

        return {
            store,
            close() {
                store.action?.(false);
                store.visible = false;
            },
            confirm() {
                store.action?.(true);
                store.visible = false;
            }
        }
    },
})
</script>

<style lang="scss" scoped>
    .prompt-wrapper {
        color: $color-text-main;
        font-size: 1.5rem;
        background-color: $color-dark-2;
        border: thin solid $color-border-dark-2;
        padding: 20px;
        @include z-depth(2);

        .button-box {
            display: flex;
            width: 100%;
            margin-top: 10px;
            justify-content: space-evenly;
        }
    }
</style>