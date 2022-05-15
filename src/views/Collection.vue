<template>
    <div class="wrapper">
        <sidebar>
            <router-link to="/">
                <button-small>Back</button-small>
            </router-link>
            <input-tag :tags="tags" @add="addTag" @remove="removeTag" :definedTags="definedTags"/>
            <button-small @click="startSetCreation">Create set</button-small>
        </sidebar>
        <div class="content-wrapper" ref="container">
            <div class="content" v-if="loaded">
                <card-new-big @click="storeImageCreate.open()"/>
                <card-image-small 
                v-for="(image, i) in filteredImages" 
                :key="i" :image="image" 
                @click="imageHandler(image, $event)" 
                @contextmenu="contextMenuOpen(image, $event)"/>
            </div>
            <screen-loading v-else/>
        </div>
        <scroll-bar @scroll="scrollToTop"/>
    </div>

    <transition-fade>
        <form-image-view v-if="storeImageView.visible"/>
    </transition-fade>

    <transition-fade>
        <form-image-create v-if="storeImageCreate.visible"/>
    </transition-fade>

    <transition-fade>
        <form-image-edit v-if="storeImageEdit.visible"/>
    </transition-fade>

    <transition-fade>
        <menu-confirm-overlay v-if="imageHandlerState == 'setCreation'" @save="saveSetCreation" @cancel="cancelSetCreation"/>
    </transition-fade>

    <transition-fade>
        <menu-context v-if="contextMenuActive" :event="contextMenuEvent" @close="contextMenuClose">
            <div @click="editImage">Изменить</div>
            <div @click="copyImage">Копировать</div>
            <div @click="deleteImage">Удалить</div>
        </menu-context>
    </transition-fade>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { useCollections } from '@/store/collections'
import { useImageViewStore } from '@/store/forms/form-image-view'
import { useImageCreateStore } from '@/store/forms/form-create-image'
import { useImageEditStore } from '@/store/forms/form-image-edit'
import { useNotificationStore } from '@/store/modals/modal-notification'
import { usePromptStore } from '@/store/modals/modal-prompt'

import useImages from '@/composables/images'
import UseTags from '@/composables/tags'
import useContextMenu from '@/composables/context-menu'
import useClipboard from '@/composables/clipboard'

import Sidebar from '@/components/Sidebar.vue'
import TransitionFade from '@/components/TransitionFade.vue'
import CardImageSmall from '@/components/CardImageSmall.vue'
import CardNewBig from '@/components/CardNewBig.vue'
import FormImageView from '@/components/FormImageView.vue'
import FormImageCreate from '@/components/FormImageCreate.vue'
import FormImageEdit from '@/components/FormImageEdit.vue'
import InputTag from '@/components/InputTag.vue'
import MenuConfirmOverlay from '@/components/MenuConfirmOverlay.vue'
import MenuContext from '@/components/MenuContext.vue'
import ScreenLoading from '@/components/ScreenLoading.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'
import ScrollBar from '@/components/ScrollBar.vue'


export default defineComponent({
    components: {
        Sidebar,
        TransitionFade,
        CardImageSmall,
        CardNewBig,
        FormImageView,
        FormImageCreate,
        FormImageEdit,
        InputTag,
        MenuConfirmOverlay,
        MenuContext,
        ScreenLoading,
        ButtonSmall,
        ScrollBar,
    },
    setup() {
        const storeCollections = useCollections();
        const storeImageView = useImageViewStore();
        const storeImageCreate = useImageCreateStore();
        const storeImageEdit = useImageEditStore();
        const storeNotification = useNotificationStore();
        const storePrompt = usePromptStore();

        const { images, filteredImages } = useImages();
        const { tags, definedTags, addTag, removeTag } = UseTags();
        const { contextMenuActive, contextMenuEvent, contextMenuOpen, contextMenuClose, contextMenuAction } = useContextMenu();
        const { copyToClipboard } = useClipboard();

        const loaded = ref(false);

        const container = ref<HTMLElement | null>(null);


        onMounted(async () => {
            if(!storeCollections.activeCollection?.loaded) {
                await storeCollections.activeCollection?.initLoadCollection();
            }
            loaded.value = true;
        });


        const imageHandlerState = ref('view');
        let selectedImages: Array<any> = [];

        function imageHandler(img: ImageSingle, event: any) {
            switch(imageHandlerState.value) {
                case 'view': {
                    viewImage(img);
                    break;
                }
                case 'setCreation': {
                    selectImageForSet(img, event);
                    break;
                }
            }
        }

        function viewImage(img: ImageSingle | ImageSet) {
            storeImageView.setImage(img);
            storeImageView.open();
        }

        function startSetCreation() {
            imageHandlerState.value = 'setCreation'
        }

        function selectImageForSet(img: ImageSingle, event: any) {
            const t = event.target.classList.toggle('selected');
            if(t) {
                selectedImages.push({image: img, ref: event.target});
            } else {
                let index = selectedImages.findIndex((elem) => elem.ref == event.target);
                selectedImages.splice(index, 1);
            }
        }

        function cancelSetCreation() {
            imageHandlerState.value = 'view';
            selectedImages.forEach((item) => {
                item.ref.classList.toggle('selected');
            });
            selectedImages = [];
        }

        function saveSetCreation() {
            imageHandlerState.value = 'view';
            selectedImages.forEach((item) => {
                item.ref.classList.toggle('selected');
            });
            storeCollections.activeCollection?.createSet(selectedImages.map((i: any) => i.image));
            selectedImages = [];
        }

        function editImage() {
            contextMenuAction((image) => {
                storeImageEdit.setImage(image);
                storeImageEdit.open();
            });
        }

        function copyImage() {
            contextMenuAction(async (image) => {
                await copyToClipboard(image);
                storeNotification.notify('Изображение скопировано!');
            });
        }

        function deleteImage() {
            contextMenuAction(async (image) => {
                const answer = await storePrompt.showPrompt('Удалить изображение?', 'confirmation');
                if(answer) storeCollections.activeCollection?.deleteImage(image);
            });
        }

        function scrollToTop() {
            container.value?.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }



        return {
            storeCollections,
            storeImageView,
            storeImageCreate,
            storeImageEdit,

            container,
            scrollToTop,

            images,
            filteredImages: filteredImages(tags),

            imageHandler,
            imageHandlerState,
            startSetCreation,
            cancelSetCreation,
            saveSetCreation,

            tags,
            definedTags,
            addTag, 
            removeTag,

            contextMenuActive,
            contextMenuOpen,
            contextMenuClose,
            contextMenuEvent,

            editImage,
            copyImage,
            deleteImage,

            loaded,
        }
    },
})
</script>

<style lang="scss" scoped>
    .wrapper {
        display: flex;
        height: 100vh;
    }

    .content-wrapper {
        height: 100%;
        flex-grow: 1;
        overflow-y: auto;
        @include flex-start;
        @include scroll;

        .content {
            margin: 3vh 4vw 3vh 3vw;
            flex-grow: 1;
            @include flex-center;
            justify-content: flex-start;

            .image-card {
                margin: 15px;
            }
        }
    }
</style>
