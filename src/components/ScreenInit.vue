<template>
    <modal-dark>
        <div class="init-wrapper">
            <p class="message">Due to a restriction of the File System Access API and Permissions API, 
                the user must grant access to the folder every time he visits the site.</p>
            <button-small @click="requestFolder">Pick folder</button-small>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ModalDark from '@/components/ModalDark.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'

import useFileSystem from '@/composables/file-system'

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall,
    },
    emits: ['data'],
    setup(props, { emit }) {
        const { requestMainFolderAccess, initLoadCollections } = useFileSystem();

        async function requestFolder() {
            await requestMainFolderAccess();
            const data = await initLoadCollections();
            emit('data', data);
        }

        return {
            requestFolder,
        }
    },
})
</script>

<style lang="scss" scoped>
    .init-wrapper {
        padding: 30px;
        max-width: 40vw;
        background-color: $color-dark-1;
        border: thin solid $color-border-dark-1;
        @include  z-depth();

        .message {
            color: $color-text-main;
            font-size: 1.5rem;
        }
    }
</style>
