<template>
    <modal-dark data-test="screen-init">
        <div class="init-wrapper" v-if="compatibility">
            <p class="message">
                {{ t('INIT_SCREEN.MESSAGE') }}
            </p>
            <button-small @click="requestFolderAccess()">
                {{ t('BUTTON.PICK_FOLDER') }}</button-small>
        </div>
        <div class="init-wrapper" v-else>
            <p class="message">
                {{ t('INIT_SCREEN.BROWSER_INCOMPATIBLE') }}
            </p>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { useI18n } from 'vue-i18n'

import { useInitStore } from "@/store/modals/modal-init";

import ModalDark from "@/components/ModalDark.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall,
    },
    emits: ["data"],
    setup(props, { emit }) {
        const store = useInitStore();
        const compatibility = ref(true);
        const { t } = useI18n();

        async function requestFolderAccess() {
            emit("data", await store.requestFolderAccess());
        }

        onBeforeMount(() => {
            compatibility.value = store.checkCompatibility;
        });

        return {
            requestFolderAccess,
            compatibility,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.init-wrapper {
    padding: 30px;
    max-width: 40vw;
    background-color: $color-dark-1;
    border: thin solid $color-border-dark-1;
    @include z-depth();

    .message {
        color: $color-text-main;
        font-size: 1.5rem;
    }
}
</style>
