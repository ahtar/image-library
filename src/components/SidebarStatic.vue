<template>
    <div class="sidebar-wrapper">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return {};
    },
});
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    z-index: 1;
    width: 10vw;
    flex-shrink: 0;
    padding-top: 1vh;
    padding: 1vh 1vw 0 1vw;
    @include material(1);
}

::v-slotted(*) {
    margin-bottom: 2vh;
}
</style>
