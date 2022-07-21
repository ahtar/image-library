<template>
    <div class="home">
        <div class="block">
            <card-new-big @click="storeCollectionCreate.open" />
            <router-link :to="link(collection)" v-for="(collection, i) in store.collections" :key="i"
                @contextmenu="contextMenuOpen(collection, $event)">
                <card-collection-big :fileHandle="collection.thumbnail" />
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
            <div @click="editCollection">Изменить</div>
            <div @click="deleteCollection">Удалить</div>
        </menu-context>
    </transition-fade>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CardCollectionBig from "@/components/CardCollectionBig.vue";
import CardNewBig from "@/components/CardNewBig.vue";
import TransitionFade from "@/components/TransitionFade.vue";
import FormCollectionCreate from "@/components/formCollectionCreate.vue";
import FormCollectionEdit from "@/components/FormCollectionEdit.vue";
import MenuContext from "@/components/MenuContext.vue";

import { useCollections } from "@/store/collections";
import { useCollectionCreateStore } from "@/store/forms/form-collection-create";
import { usePromptStore } from "@/store/modals/modal-prompt";
import { useCollectionEditStore } from "@/store/forms/form-collection-edit";
import useContextMenu from "@/composables/context-menu";

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
        const store = useCollections();
        const storeCollectionCreate = useCollectionCreateStore();
        const storeCollectionEdit = useCollectionEditStore();
        const storePrompt = usePromptStore();
        const {
            contextMenuActive,
            contextMenuEvent,
            contextMenuOpen,
            contextMenuClose,
            contextMenuAction,
        } = useContextMenu();

        function link(collection: Collection) {
            return "/collections/" + collection.manifest.name;
        }

        function editCollection() {
            contextMenuAction<Collection>((item) => {
                storeCollectionEdit.open(item);
            });
        }

        function deleteCollection() {
            contextMenuAction<Collection>(async (item) => {
                const answer = await storePrompt.showPrompt("Удалить коллекцию?");
                if (answer) {
                    store.deleteCollection(item);
                }
            });
        }

        return {
            store,
            storeCollectionCreate,
            storeCollectionEdit,
            editCollection,
            deleteCollection,
            link,

            contextMenuEvent,
            contextMenuActive,
            contextMenuClose,
            contextMenuOpen,
        };
    },
});
</script>

<style lang="scss" scoped>
.home {
    padding-top: 15vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.block {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
