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
                <transition-fade-group :items="displayedImages" v-slot="slotProps">
                  <card-image-small
                    :image="slotProps.item" 
                    @click="imageHandler(slotProps.item, $event)" 
                    @contextmenu="contextMenuOpen(slotProps.item, $event)"/>
                </transition-fade-group>
                <intersection-observer-vue ref="observer" @update="observerHandler"/>
            </div>
            <screen-loading v-else/>
        </div>
        <scroll-bar @scroll="scrollToTop"/>
    </div>

    <transition-fade>
        <form-image-view v-if="storeImageView.visible"/>
    </transition-fade>

    <transition-fade>
        <form-image-create :definedTags="definedTags" @saveImage="saveImageEvent"  v-if="storeImageCreate.visible"/>
    </transition-fade>

    <transition-fade>
        <form-image-edit @updateImage="editImageEvent" v-if="storeImageEdit.visible"/>
    </transition-fade>

    <transition-fade>
        <menu-confirm-overlay v-if="imageHandlerState == 'setCreation'" @save="saveSetCreation" @cancel="cancelSetCreation"/>
    </transition-fade>

    <transition-fade>
        <menu-context v-if="contextMenuActive" :event="contextMenuEvent!" @close="contextMenuClose">
            <div @click="editImage">Изменить</div>
            <div @click="copyImage">Копировать</div>
            <div @click="deleteImage">Удалить</div>
        </menu-context>
    </transition-fade>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

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
import useQuery from '@/composables/query'
import useImageDisplay from '@/composables/imagesDisplay'

import Sidebar from '@/components/Sidebar.vue'
import TransitionFade from '@/components/TransitionFade.vue'
import TransitionFadeGroup from '@/components/TransitionFadeGroup.vue'
import CardImageSmall from '@/components/CardImageSmall.vue'
import CardNewBig from '@/components/CardNewBig.vue'
import FormImageView from '@/components/FormImageView.vue'
import FormImageCreate from '@/components/FormImageCreate.vue'
import FormImageEdit from '@/components/FormImageEdit.vue'
import InputTag from '@/components/InputTag.vue'
import IntersectionObserverVue from '@/components/IntersectionObserver.vue'
import MenuConfirmOverlay from '@/components/MenuConfirmOverlay.vue'
import MenuContext from '@/components/MenuContext.vue'
import ScreenLoading from '@/components/ScreenLoading.vue'
import ButtonSmall from '@/components/ButtonSmall.vue'
import ScrollBar from '@/components/ScrollBar.vue'


export default defineComponent({
    components: {
        Sidebar,
        TransitionFade,
        TransitionFadeGroup,
        CardImageSmall,
        CardNewBig,
        FormImageView,
        FormImageCreate,
        FormImageEdit,
        InputTag,
        IntersectionObserverVue,
        MenuConfirmOverlay,
        MenuContext,
        ScreenLoading,
        ButtonSmall,
        ScrollBar,
    },
    setup() {
        const route = useRoute();
        let collection = ref<Collection | null>(null);
        const loaded = ref(false);

        const storeCollections = useCollections();
        const storeImageView = useImageViewStore();
        const storeImageCreate = useImageCreateStore();
        const storeImageEdit = useImageEditStore();
        const storeNotification = useNotificationStore();
        const storePrompt = usePromptStore();

        const { images, filteredImages, setImages, setTagRef } = useImages();
        const { setDisplayableImages, displayedImages, displayNextImages, resetDisplayedImages } = useImageDisplay();
        const { tags, definedTags, addTag, removeTag, tagsOnChange } = UseTags();
        const { contextMenuActive, contextMenuEvent, contextMenuOpen, contextMenuClose, contextMenuAction } = useContextMenu();
        const { copyToClipboard } = useClipboard();
        const { arrayToQuery, setQuery, getQuery } = useQuery();

        const container = ref<HTMLElement | null>(null);
        const observer = ref<InstanceType<typeof IntersectionObserverVue> | null>(null);




    
        setTagRef(tags);
        setDisplayableImages(filteredImages as any);



        /**
        * Работа с коллекцией и параметрами роутера.
        */

        //Инициализация.
        onMounted(async () => {
            //Получение тегов из query параметров
            const query = getQuery();
            if(query.tags) {
                for(const tag of query.tags) {
                    addTag(tag);
                }
            }
            //Инициализация коллекции, если она ещё не инициализирована и сами коллекции уже получены.
            //Название коллекции берется из параметра роутера.
            const status = await initCollection();

            //Если коллекции ещё не получены (приложение было открыто сразу на какой-либо коллекции, например */collections/CollectionName)
            //то дождаться получения коллекций, и после этого инициализировать коллекцию.
            if(!status) {
                watch(() => [...storeCollections.collections], async () => {
                    await initCollection();
                    setImages(ref(collection.value!.arr) as any);
                });
            } else {
                //Если коллекция уже инициализирована
                setImages(ref(collection.value!.arr) as any);
            }
        });

        //Если коллекция в параметре роутера каким-либо образом изменилась 
        //(например, пользователь сам изменил ссылку */collections/CollectionName => */collections/NewName)
        //то сделать активной эту коллекцию.
        watch(() => route.params, async () => {
            await initCollection();
            setImages(ref(collection.value!.arr) as any);
            resetDisplayedImages();
            observer.value?.checkIntersection();
        });

        //Инициализация коллекции, полученной из параметров роутера.
        async function initCollection() {
            try {
                const c = storeCollections.getCollection(route.params.name as string);
                if(c) {
                    //Установка коллекции.
                    collection = ref(c as any);
                    storeCollections.setActiveCollection(c as any);
                
                    //Инициализация данных коллекции, т. е. загрузка изображений и тегов.
                    if(!collection.value!.loaded) {
                        await collection.value!.initLoadCollection();
                        loaded.value = true;
                        //observer.value?.checkIntersection();
                    } else {
                        loaded.value = true;
                    }
                } else return false;
                return true;
            } catch(err) {
                storeNotification.notify('При загрузке коллекции что то пошло не так', false);
                console.log(err);
            }
        }

        //Обновление query параметров в соответствии с введеными тегами.
        tagsOnChange(() => {
            setQuery({
                tags: arrayToQuery(tags.value)
            });
        });




        //Если IntersectionObserver пересекается, то отобразить следующую группу изображений
        //и затем начать проверку на пересечение ещё раз.
        function observerHandler(event: boolean) {
            if(event) {
                const status = displayNextImages(20);
                if(status) observer.value?.checkIntersection();
            }
        }






        /**
         * Работа с изображениями
         */
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
            collection.value!.createSet(selectedImages.map((i: any) => i.image));
            selectedImages = [];
        }






        /**
         * контект меню
         */
        function editImage() {
            contextMenuAction<ImageSingle | ImageSet>((image) => {
                storeImageEdit.setImage(image);
                storeImageEdit.open();
            });
        }

        function copyImage() {
            contextMenuAction<ImageSingle | ImageSet>(async (image) => {
                await copyToClipboard(image);
                storeNotification.notify('Изображение скопировано!');
            });
        }

        function deleteImage() {
            contextMenuAction<ImageSingle | ImageSet>(async (image) => {
                try {
                    const answer = await storePrompt.showPrompt('Удалить изображение?', 'confirmation');
                    if(answer && collection.value) {
                        await collection.value.deleteImage(image);
                        storeNotification.notify('Изображение удалено!');
                    }
                } catch(err) {
                    storeNotification.notify('Изображение не было удалено', false);
                    console.log(err);
                }
            });
        }

        function scrollToTop() {
            container.value?.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }




        async function saveImageEvent(data: any) {
            if(collection.value) {
                try {
                    await collection.value.createImage(data.manifest, data.imageBlob);
                    storeNotification.notify('Изображение создано!');
                } catch(err) {
                    storeNotification.notify('Изображение не было создано', false);
                    console.log(err);
                }
            }
        }

        async function editImageEvent(data: ImageSingle | ImageSet) {
            try {
                if(collection.value) {
                    await collection.value.updateImage(data);
                    storeNotification.notify('Изображение измененно!');
                } else storeNotification.notify('Что-то пошло не так');
            } catch(err) {
                console.log(err);
                storeNotification.notify('Изображение не измененно!', false);
            }
        }

        return {
            storeImageView,
            storeImageCreate,
            storeImageEdit,

            container,
            observer,
            scrollToTop,

            images,
            filteredImages,//: filteredImages(tags),
            displayedImages,
            observerHandler,

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

            saveImageEvent,
            editImageEvent,
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
