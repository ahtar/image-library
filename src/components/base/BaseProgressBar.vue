<template>
    <progress class="progress-bar" :max="max" :value="value" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    props: {
        max: {
            type: Number,
        },
        value: {
            type: Number,
        },
    },

    setup() {
        return {};
    },
});
</script>

<style lang="scss" scoped>
</style>
