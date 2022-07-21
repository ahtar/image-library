<template>
    <button :class="classList()" :tabindex="tabIndex">
        <slot />
        <div class="blocked" v-if="blocked"></div>
    </button>
</template>

<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        blocked: {
            default: false,
            type: Boolean,
        },
    },
    setup(props) {
        return {
            tabIndex: computed(() => {
                if (props.blocked) return -1;
                return 1;
            }),
            classList() {
                if (props.blocked) return "btn-blc";
                return "btn";
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.btn {
    background-color: $color-dark-3;
    color: $color-text-second;
    border: thin solid $color-border-dark-3;
    position: relative;
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

.blocked {
    position: absolute;
    z-index: 10;
    height: calc(100% + 2px);
    width: calc(100% + 2px);
    background-color: $color-shadow;
    top: -1px;
    left: -1px;

    &:hover {
        cursor: initial;
    }
}

.btn-blc {
    background-color: $color-dark-3;
    color: $color-text-second;
    border: thin solid $color-border-dark-3;
    position: relative;
    font-size: 1rem;
    @include z-depth(2);
    @include z-depth-transition();
}
</style>
