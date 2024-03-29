<template>
    <div class="home">
        <div class="block">
            <card-new-big @click="storeCollectionCreate.open" data-test="home-card-new"
                v-tooltip.auto="t('TOOLTIP.NEW_COLLECTION')"
                :class="{ 'card-animated': storeSettings.showCardAnimations }" />
            <router-link :to="link(collection)" v-for="(collection, i) in storeCollections.collections" :key="i"
                @contextmenu="contextMenuOpen(collection, $event)">
                <card-collection-big :fileHandle="collection.thumbnail" :class="{
                    'card-animated': storeSettings.showCardAnimations,
                }" />
            </router-link>
        </div>
    </div>

    <transition-fade>
        <form-collection-create v-if="storeCollectionCreate.visible" />
    </transition-fade>

    <transition-fade>
        <form-collection-edit v-if="storeCollectionEdit.visible" />
    </transition-fade>

    <transition-fade>
        <menu-context :event="contextMenuEvent!" v-if="contextMenuActive" @close="contextMenuClose">
            <div @click="editCollection">{{ t('BUTTON.EDIT') }}</div>
            <div @click="deleteCollection">{{ t('BUTTON.DELETE') }}</div>
        </menu-context>
    </transition-fade>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import CardCollectionBig from '@/components/CardCollectionBig.vue';
import CardNewBig from '@/components/CardNewBig.vue';
import TransitionFade from '@/components/TransitionFade.vue';
import FormCollectionCreate from '@/components/formCollectionCreate.vue';
import FormCollectionEdit from '@/components/FormCollectionEdit.vue';
import MenuContext from '@/components/MenuContext.vue';

import { useCollections } from '@/store/collections';
import { useCollectionCreateStore } from '@/store/forms/form-collection-create';
import { usePromptStore } from '@/store/modals/modal-prompt';
import { useCollectionEditStore } from '@/store/forms/form-collection-edit';
import { useSettings } from '@/store/settings';

import { useHead } from '@vueuse/head';
import useContextMenu from '@/composables/context-menu';

export default defineComponent({
    components: {
        CardCollectionBig,
        CardNewBig,
        TransitionFade,
        FormCollectionCreate,
        FormCollectionEdit,
        MenuContext,
    },

    setup() {
        const { t } = useI18n();
        const storeCollections = useCollections();
        const storeCollectionCreate = useCollectionCreateStore();
        const storeCollectionEdit = useCollectionEditStore();
        const storePrompt = usePromptStore();
        const storeSettings = useSettings();
        const {
            contextMenuActive,
            contextMenuEvent,
            contextMenuOpen,
            contextMenuClose,
            contextMenuAction,
        } = useContextMenu();

        useHead({
            title: 'Home — Image Library',
        });

        function link(collection: Collection) {
            return '/collections/' + collection.manifest.name;
        }

        function editCollection() {
            contextMenuAction<Collection>((item) => {
                storeCollectionEdit.open(item);
            });
        }

        function deleteCollection() {
            contextMenuAction<Collection>(async (item) => {
                const answer = await storePrompt.showPrompt(
                    t('PROMPT.DELETE_COLLECTION')
                );
                if (answer) {
                    storeCollections.deleteCollection(item);
                }
            });
        }

        return {
            storeCollections,
            storeCollectionCreate,
            storeCollectionEdit,
            storeSettings,
            editCollection,
            deleteCollection,
            link,

            contextMenuEvent,
            contextMenuActive,
            contextMenuClose,
            contextMenuOpen,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.home {
    padding-top: 15vh;
    @include flex-center();
}

.block {
    flex-wrap: wrap;
    @include flex-center();

    .card-animated {
        @include card-hover();
    }
}
</style>
