<template>
    <header class="header">
        <div class="section">
            <select-list
                :data="store.language.languageData"
                :model-value="store.language.appLanguage"
                @update:model-value="store.changeLanguage"
            />
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SelectList from './SelectList.vue';
import { useSettings } from '@/store/settings';

export default defineComponent({
    components: {
        SelectList,
    },

    setup() {
        const store = useSettings();

        return {
            store,
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
    position: relative;
    @include flex-center-vertical();

    .section {
        margin-right: 20px;
    }
}
</style>
