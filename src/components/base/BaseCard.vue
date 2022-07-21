<template>
    <div class="base-card">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.base-card {
    background-color: $color-dark-4;
    border: thin solid $color-border-dark-4;
    color: $color-text-main;
    font-size: 0;
    @include z-depth(2);
    @include z-depth-transition();

    &:hover {
        background-color: $color-dark-5;
        border-color: $color-border-dark-5;
        cursor: pointer;
        @include z-depth-focus();
    }
}
</style>
