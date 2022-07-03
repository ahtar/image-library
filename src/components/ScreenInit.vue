<template>
    <modal-dark>
        <div class="init-wrapper" v-if="compatibility">
            <p class="message">Due to a restriction of the File System Access API and Permissions API, 
                the user must grant access to the folder every time he visits the site.</p>
            <button-small @click="requestFolderAccess()">Pick folder</button-small>
        </div>
        <div class="init-wrapper" v-else>
            <p class="message">Данный браузер не поддерживает функционал этого сайта.</p>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue'

import { useInitStore } from '@/store/modals/modal-init'

import ModalDark from '@/components/ModalDark.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall,
    },
    emits: ['data'],
    setup(props, { emit }) {
        const store = useInitStore();
        const compatibility = ref(true);

        async function requestFolderAccess() {
            emit('data', await store.requestFolderAccess());
        }


        onBeforeMount(() => {
            compatibility.value = check();
        })


        function check() {
            const options = [
                {
                    text: 'window.showDirectoryPicker',
                    data: window.showDirectoryPicker
                },
                {
                    text: 'navigator.clipboard',
                    data: navigator.clipboard
                },
                {
                    text: 'FileSystemFileHandle',
                    data: globalThis.FileSystemFileHandle.prototype
                },
                {
                    text: 'FileSystemDirectoryHandle',
                    data: globalThis.FileSystemDirectoryHandle.prototype
                },
                {
                    text: 'FileSystemWritableFileStream',
                    data:  globalThis.FileSystemFileHandle?.prototype.createWritable
                }
            ];
            for(const opt of options) {
                if(opt.data == undefined) {
                    console.info('no compatibility', opt.text);
                    return false;
                }
            }
            return true;
        }

        return {
            requestFolderAccess,
            compatibility,
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
