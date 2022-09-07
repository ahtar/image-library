<template>
    <base-card class="card-new-big" tabindex="0" data-test="card-new-big"/>
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
    @include flex-center();

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
