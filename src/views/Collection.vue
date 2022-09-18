<template>
    <div class="wrapper">
        <sidebar>
            <router-link to="/">
                <button-small>{{ t('BUTTON.BACK') }}</button-small>
            </router-link>
            <input-tag
                :tags="tags"
                @add="addTag"
                @remove="removeTag"
                :definedTags="definedTags"
            />
            <button-small
                @click="startSetCreation"
                v-tooltip.auto="t('TOOLTIP.NEW_SET')"
                >{{ t('BUTTON.CREATE_SET') }}
            </button-small>
        </sidebar>
        <div class="content-wrapper" ref="container">
            <div class="content" v-if="loaded">
                <card-new-big
                    @click="storeImageCreate.open()"
                    v-tooltip.auto="t('TOOLTIP.NEW_IMAGE')"
                />
                <transition-fade-group
                    :items="filteredImages"
                    v-slot="slotProps"
                >
                    <card-image-small
                        :image="slotProps.item"
                        @click="imageClickHandler(slotProps.item, $event)"
                        @contextmenu="contextMenuOpen(slotProps.item, $event)"
                    />
                </transition-fade-group>
            </div>
            <screen-loading v-else />
        </div>
        <scroll-bar @scroll="scrollToTop" />
    </div>

    <transition-fade>
        <form-image-view v-if="storeImageView.visible" />
    </transition-fade>

    <transition-fade>
        <form-image-create
            :definedTags="definedTags"
            :priorTags="lastTags"
            v-if="storeImageCreate.visible"
        />
    </transition-fade>

    <transition-fade>
        <form-image-edit v-if="storeImageEdit.visible" />
    </transition-fade>

    <transition-fade>
        <menu-confirm-overlay
            v-if="imageHandlerState == 'setCreation'"
            @save="saveSetCreation"
            @cancel="cancelSetCreation"
        />
    </transition-fade>

    <transition-fade>
        <menu-context
            v-if="contextMenuActive"
            :event="contextMenuEvent!"
            @close="contextMenuClose"
        >
            <div @click="editImage">{{ t('BUTTON.EDIT') }}</div>
            <div @click="copyImage">{{ t('BUTTON.COPY') }}</div>
            <div @click="deleteImage">{{ t('BUTTON.DELETE') }}</div>
        </menu-context>
    </transition-fade>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { useCollections } from '@/store/collections';
import { useImageViewStore } from '@/store/forms/form-image-view';
import { useImageCreateStore } from '@/store/forms/form-create-image';
import { useImageEditStore } from '@/store/forms/form-image-edit';
import { useNotificationStore } from '@/store/modals/modal-notification';
import { usePromptStore } from '@/store/modals/modal-prompt';

import useImages from '@/composables/images';
import UseTags from '@/composables/tags';
import useContextMenu from '@/composables/context-menu';
import useClipboard from '@/composables/clipboard';
import useQuery from '@/composables/query';
import { useHead } from '@vueuse/head';

import Sidebar from '@/components/Sidebar.vue';
import TransitionFade from '@/components/TransitionFade.vue';
import TransitionFadeGroup from '@/components/TransitionFadeGroup.vue';
import CardImageSmall from '@/components/CardImageSmall.vue';
import CardNewBig from '@/components/CardNewBig.vue';
import FormImageView from '@/components/FormImageView.vue';
import FormImageCreate from '@/components/FormImageCreate.vue';
import FormImageEdit from '@/components/FormImageEdit.vue';
import InputTag from '@/components/InputTag.vue';
import MenuConfirmOverlay from '@/components/MenuConfirmOverlay.vue';
import MenuContext from '@/components/MenuContext.vue';
import ScreenLoading from '@/components/ScreenLoading.vue';
import ButtonSmall from '@/components/ButtonSmall.vue';
import ScrollBar from '@/components/ScrollBar.vue';

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
        MenuConfirmOverlay,
        MenuContext,
        ScreenLoading,
        ButtonSmall,
        ScrollBar,
    },
    setup() {
        const { t } = useI18n();
        const route = useRoute();
        //Просматриваемая коллекция
        let collection = ref<Collection | null>(null);
        //Загружена ли коллекция
        const loaded = ref(false);
        const container = ref<HTMLElement | null>(null);
        const imageHandlerState = ref<'view' | 'setCreation'>('view');
        //массив с выбранными изображениями для создания нового сета
        const selectedImages = ref<Array<{ image: ImageSingle; ref: Element }>>(
            []
        );
        //последние используемые теги при создании изображения
        const lastTags = computed(() => {
            if (collection.value) {
                return collection.value.lastTags;
            }
            return [];
        });

        const storeCollections = useCollections();
        const storeImageView = useImageViewStore();
        const storeImageCreate = useImageCreateStore();
        const storeImageEdit = useImageEditStore();
        const storeNotification = useNotificationStore();
        const storePrompt = usePromptStore();

        const { images, filteredImages, setImages, setTagRef } = useImages();
        const { tags, definedTags, addTag, removeTag, tagsOnChange } =
            UseTags();
        const { copyToClipboard } = useClipboard();
        const { arrayToQuery, setQuery, getQuery } = useQuery();
        const {
            contextMenuActive,
            contextMenuEvent,
            contextMenuOpen,
            contextMenuClose,
            contextMenuAction,
        } = useContextMenu();

        setTagRef(tags);
        //Изменение названия страницы
        useHead({
            title: computed(() => route.params.name + ' — Image Library'),
        });
        //Обновление query параметров в соответствии с введеными тегами.
        tagsOnChange(() => {
            setQuery({
                tags: arrayToQuery(tags.value),
            });
        });

        onMounted(async () => {
            //Получение тегов из query параметров
            const query = getQuery();
            if (query.tags) {
                for (const tag of query.tags) {
                    if (tag) addTag(tag);
                }
            }

            //Инициализация коллекции
            const initCollectionStatus = await initCollection();

            //Если коллекции ещё не получены (приложение было открыто сразу на какой-либо коллекции, например */collections/CollectionName)
            //то дождаться получения коллекций, и после этого инициализировать коллекцию.
            if (!initCollectionStatus) {
                watch(
                    () => [...storeCollections.collections],
                    async () => {
                        await initCollection();
                        if (!collection.value) return;
                        setImages(ref(collection.value.arr));
                    }
                );
            } else {
                if (!collection.value) return;
                setImages(ref(collection.value.arr));
            }
        });

        //Смена активной коллекции при изменении route.params.name
        watch(
            () => route.params.name,
            async () => {
                //изменение статуса загрузки для отображения окна загрузки коллекции
                loaded.value = false;
                await initCollection();
                if (!collection.value) return;

                setImages(ref(collection.value.arr));
            }
        );

        async function initCollection() {
            try {
                //Получение новой коллекции
                const newCollection = storeCollections.getCollection(
                    route.params.name as string
                );
                if (!newCollection) return false;

                //Установка новой коллекции как активной
                collection.value = newCollection;
                storeCollections.setActiveCollection(collection.value);

                //Инициализация новой коллекции, если она не инициализированна
                if (!collection.value.loaded) {
                    await collection.value.initLoadCollection();
                    loaded.value = true;
                    return true;
                }
                loaded.value = true;
                return true;
            } catch (err) {
                storeNotification.notify(
                    t('NOTIFICATION.MESSAGE.COLLECTION_LOAD_ERROR'),
                    false
                );
                console.log(err);
            }
        }

        function imageClickHandler(img: ImageSingle, event: MouseEvent) {
            switch (imageHandlerState.value) {
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
            imageHandlerState.value = 'setCreation';
        }

        function selectImageForSet(img: ImageSingle, event: MouseEvent) {
            if (!event.target) return;
            const target = event.target as Element;
            const toggle = target.classList.toggle('selected');
            if (toggle) {
                selectedImages.value.push({ image: img, ref: target });
            } else {
                let index = selectedImages.value.findIndex(
                    (elem) => elem.ref == event.target
                );
                selectedImages.value.splice(index, 1);
            }
        }

        function cancelSetCreation() {
            imageHandlerState.value = 'view';
            selectedImages.value.forEach((item) => {
                item.ref.classList.toggle('selected');
            });
            selectedImages.value.length = 0;
        }

        function saveSetCreation() {
            if (!collection.value) return;
            imageHandlerState.value = 'view';
            selectedImages.value.forEach((item) => {
                item.ref.classList.toggle('selected');
            });
            collection.value.createSet(
                selectedImages.value.map((i) => i.image)
            );
            selectedImages.value.length = 0;
        }

        function editImage() {
            contextMenuAction<ImageSingle | ImageSet>((image) => {
                storeImageEdit.setImage(image);
                storeImageEdit.open();
            });
        }

        function copyImage() {
            contextMenuAction<ImageSingle | ImageSet>(async (image) => {
                await copyToClipboard(image);
                storeNotification.notify(
                    t('NOTIFICATION.MESSAGE.IMAGE_COPIED')
                );
            });
        }

        function deleteImage() {
            contextMenuAction<ImageSingle | ImageSet>(async (image) => {
                try {
                    const answer = await storePrompt.showPrompt(
                        t('PROMPT.DELETE_IMAGE'),
                        'confirmation'
                    );
                    if (answer && collection.value) {
                        await collection.value.deleteImage(image);
                        storeNotification.notify(
                            t('NOTIFICATION.MESSAGE.IMAGE_DELETED')
                        );
                    }
                } catch (err) {
                    storeNotification.notify(
                        t('NOTIFICATION.MESSAGE.IMAGE_DELETE_ERROR'),
                        false
                    );
                    console.log(err);
                }
            });
        }

        function scrollToTop() {
            container.value?.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }

        return {
            storeImageView,
            storeImageCreate,
            storeImageEdit,

            container,
            scrollToTop,

            images,
            filteredImages,

            imageClickHandler,
            imageHandlerState,
            startSetCreation,
            cancelSetCreation,
            saveSetCreation,

            tags,
            definedTags,
            addTag,
            removeTag,
            lastTags,

            contextMenuActive,
            contextMenuOpen,
            contextMenuClose,
            contextMenuEvent,

            editImage,
            copyImage,
            deleteImage,

            loaded,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    height: 100%;
}

.content-wrapper {
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    @include scroll;

    .content {
        margin: 3vh 4vw 3vh 3vw;
        flex-grow: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        align-content: flex-start;

        .image-card {
            margin: 15px;
        }
    }
}
</style>
