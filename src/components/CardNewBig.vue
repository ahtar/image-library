<template>
    <base-card class="card-new-big" tabindex="0" />
</template>
<script lang="ts">
import { defineComponent } from "vue";

import BaseCard from "@/components/base/BaseCard.vue";

export default defineComponent({
    components: {
        BaseCard,
    },
});
</script>

<style lang="scss" scoped>
.card-new-big {
    width: $card-width-big;
    height: $card-height-big;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
        content: "+";
        font-size: 6rem;
        color: $color-text-second;
    }

    &:hover::after {
        color: $color-text-main;
    }
}
</style>
