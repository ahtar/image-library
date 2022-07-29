<template>
    <header class="header">
        <div class="section">
            <select-list :data="langData" v-model="lang"/>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import i18n from "@/locales/i18n";

import SelectList from "./SelectList.vue";

export default defineComponent({

    components: {
        SelectList
    },

    setup() {
        const lang = ref('en');
        const langData: [string, string][] = [['en', 'EN'], ['ru', 'RU']]

        watch(() => lang.value, () => {
            i18n.global.locale.value = lang.value;
        });

        return {
            lang,
            langData
        }
    }

});
</script>

<style lang="scss" scoped>
.header {
    height: 4vh;
    background-color: $color-dark-1;
    outline: thin solid $color-border-dark-1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .section {
        margin-right: 20px;
    }
}
</style>