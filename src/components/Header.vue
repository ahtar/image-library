<template>
    <header class="header">
        <div class="section">
            <input-select-list
                :data="store.language.languageData"
                :model-value="store.language.appLanguage"
                @update:model-value="store.changeLanguage"
            />
        </div>
        <div class="section">
            <button-small
                @click="showSettings"
                class="button-settings"
                ref="buttonSettings"
            >
                <img src="@/assets/settings.svg" />
            </button-small>
        </div>
    </header>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, ref } from 'vue';

import InputSelectList from './InputSelectList.vue';
import ButtonSmall from './ButtonSmall.vue';
import { useSettings } from '@/store/settings';

export default defineComponent({
    components: {
        InputSelectList,
        ButtonSmall,
    },

    setup() {
        const store = useSettings();
        const buttonSettings = ref<ComponentPublicInstance>();

        function showSettings() {
            store.visible = true;

            if (buttonSettings.value) buttonSettings.value.$el.blur();
        }

        return {
            store,
            buttonSettings,
            showSettings,
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
