<template>
    <modal-dark @close="close" data-test="modal">
        <div class="content-wrapper" data-test="collection-edit-wrapper">
            <input-text label="Name" placeholder="Collection name" :important="true" v-model="data.name" data-test="collection-edit-name"/>
            <input-text label="Theme" placeholder="Collection theme" v-model="data.theme" data-test="collection-edit-theme"/>
            <input-text label="Description" class="input-description" placeholder="Collection description" v-model="data.description" :textarea="true" data-test="collection-edit-description"/>
            <button-small @click="save" :blocked="!buttonSaveActive">Save</button-small>
        </div>

        <div class="image-wrapper wrapper">
            <input-image :active="true" :blob="data.blob!" @paste="imagePasteEvent" data-test="collection-edit-image"/>
        </div>
    </modal-dark>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'

    import ModalDark from '@/components/ModalDark.vue'
    import InputText from '@/components/InputText.vue'
    import InputImage from '@/components/InputImage.vue'
    import ButtonSmall from '@/components/ButtonSmall.vue'

    import { useCollectionEditStore } from '@/store/forms/form-collection-edit'


    export default defineComponent({
        components: {
            ModalDark,
            InputText,
            InputImage,
            ButtonSmall,
        },
        setup() {
            const store = useCollectionEditStore();

            const buttonSaveActive = computed(() => {
                return store.form.name != '';
            });

            async function imagePasteEvent(data: Blob) {
                store.form.blob = data;
            }

            return {
                data: store.form,
                close() {
                    store.close();
                },
                save() {
                    store.save();
                },
                imagePasteEvent,
                buttonSaveActive,
            }
        }
    });
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

        .input-description {
            height: 50%;
        }

        .input-wrapper {
            width: 96%;
            margin: 2%;
        }
    }

    .image-wrapper {
        margin-right: 3vw;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .button-small {
        margin: 2%;
    }
</style>