<template>
    <button class="btn" tabindex="0">
        <slot/>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {

        }
    },
})
</script>

<style lang="scss" scoped>
    .btn {
        background-color: $color-dark-3;
        color: $color-text-second;
        border: thin solid $color-border-dark-3;
        font-size: 1rem;
        @include z-depth(2);
        @include z-depth-transition();

        &:hover {
            cursor: pointer;
            color: $color-text-main;
            background-color: $color-dark-4;
            border: thin solid $color-border-dark-4;
        }
        &:focus {
            color: $color-text-main;
            background-color: $color-dark-4;
            border: thin solid $color-border-dark-4;
            outline: 2px solid $color-outline-dark;
            @include focus();
        }
    }
</style>
