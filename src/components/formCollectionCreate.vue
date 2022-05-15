<template>
    <modal-dark @close="store.close">
        <div class="content-wrapper">
            <input-text v-model="store.form.name" label="Name" placeholder="Input collection name" :important="true"/>
            <input-text v-model="store.form.theme" label="Theme" placeholder="Input collection theme"/>
            <input-text class="input-description" v-model="store.form.description" label="Description" placeholder="Input collection description" :textarea="true"/>
            <div class="button-wrapper">
                <button-small @click="save">Save</button-small>
                <button-small @click="clear">Clear</button-small>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image :active="true" :blob="store.form.blob" @paste="imagePasteEvent"/>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ModalDark from '@/components/ModalDark.vue'
import InputText from '@/components/InputText.vue'
import InputImage from '@/components/InputImage.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'

import { useCollectionCreateStore } from '@/store/forms/form-collection-create'

export default defineComponent({
    components: {
        ModalDark,
        InputText,
        InputImage,
        ButtonSmall,
    },
    setup() {
        const store = useCollectionCreateStore();

        async function imagePasteEvent(data: Blob) {
            store.form.blob = data;
        }

        function save() {
            store.createCollection();
        }

        function clear() {
            store.clearForm();
        }

        return {
            store,
            imagePasteEvent,
            save,
            clear,
        }
    },
})
</script>

<style lang="scss" scoped>
    .content-wrapper {
        width: 30vw;
        height: 40vh;
        margin-left: 10vw;
        background-color: $color-dark-1;
        border: thin solid $color-border-dark-1;
        border-radius: $radius-big;
        @include z-depth();
        display: flex;
        align-items: flex-start;
        flex-direction: column;

        .button-wrapper {
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-around;
        }

        .input-wrapper {
            width: 96%;
            margin: 2%;
        }

        .input-description {
            height: 50%;
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
