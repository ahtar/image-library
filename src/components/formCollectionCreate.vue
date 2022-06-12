<template>
    <modal-dark @close="store.close">
        <div class="content-wrapper" data-test="collection-create-wrapper">
            <input-text id="input-name" v-model="store.form.name" label="Name" placeholder="Input collection name" :important="true" data-test="collection-create-name"/>
            <input-text id="input-theme" v-model="store.form.theme" label="Theme" placeholder="Input collection theme" data-test="collection-create-theme"/>
            <input-text id="input-desc" class="input-description" v-model="store.form.description" label="Description" placeholder="Input collection description" :textarea="true" data-test="collection-create-description"/>
            <div class="button-wrapper">
                <button-small id="form-save" @click="save" :blocked="saveButtonActive == false" data-test="collection-create-save">Save</button-small>
                <button-small id="form-clear" @click="clear" data-test="collection-create-clear">Clear</button-small>
            </div>
        </div>
        <div class="image-wrapper wrapper">
            <input-image :active="true" :blob="store.form.blob" @paste="imagePasteEvent" data-test="collection-create-image"/>
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
import { computed } from '@vue/reactivity'

export default defineComponent({
    components: {
        ModalDark,
        InputText,
        InputImage,
        ButtonSmall,
    },
    setup() {
        const store = useCollectionCreateStore();

        const saveButtonActive = computed(() => {
            if(store.form.name == '' || store.form.name == undefined) return false;
            return true;
        });

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
            saveButtonActive,
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
