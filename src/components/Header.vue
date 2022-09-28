<template>
    <header class="header">
        <div class="section section-left" v-if="displaySidebarButton"
            @click="storeSettings.collectionSidebarVisible = !storeSettings.collectionSidebarVisible">
            <button-small class="button-settings">
                <img src="@/assets/show-sidebar.svg" />
            </button-small>
        </div>
        <div class="section">
            <input-select-list :data="storeSettings.language.languageData"
                :model-value="storeSettings.language.appLanguage" @update:model-value="storeSettings.changeLanguage" />
        </div>
        <div class="section">
            <button-small @click="showSettings" class="button-settings" ref="buttonSettings">
                <img src="@/assets/settings.svg" />
            </button-small>
        </div>
    </header>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, ref, computed } from 'vue';

import InputSelectList from './InputSelectList.vue';
import ButtonSmall from './ButtonSmall.vue';
import { useSettings } from '@/store/settings';
import { useCollections } from '@/store/collections';

export default defineComponent({
    components: {
        InputSelectList,
        ButtonSmall,
    },

    setup() {
        const storeSettings = useSettings();
        const storeCollections = useCollections();
        const buttonSettings = ref<ComponentPublicInstance>();
        const displaySidebarButton = computed(() => {
            return (storeCollections.activeCollection != null && !storeSettings.collectionUseSlideSidebar);
        });

        function showSettings() {
            storeSettings.visible = true;

            if (buttonSettings.value) buttonSettings.value.$el.blur();
        }

        return {
            storeSettings,
            storeCollections,
            buttonSettings,
            showSettings,
            displaySidebarButton,
        };
    },
});
</script> 

<style lang="scss" scoped>
.header {
    height: 4vh;
    background-color: $color-dark-1;
    outline: thin solid $color-border-dark-1;
    justify-content: flex-end;
    display: flex;
    position: relative;

    .section {
        margin-right: 20px;
        height: 100%;
        @include flex-center-vertical();
    }

    .section-left {
        margin-right: auto;
        margin-left: 20px;
    }

    .button-settings {
        background-color: transparent;
        border: none;
        box-shadow: none;

        &:hover {
            background-color: $color-dark-3;
        }

        img {
            widows: 100%;
            height: 100%;
        }
    }
}
</style>
