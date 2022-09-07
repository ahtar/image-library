<template>
    <div class="base-card">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.base-card {
    color: $color-text-main;
    font-size: 0;
    @include material(4);
    @include z-depth-transition();

    &:hover {
        cursor: pointer;
        @include material(5);
        @include z-depth-focus();
    }
}
</style>
