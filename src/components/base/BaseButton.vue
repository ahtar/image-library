<template>
    <button :class="classList()" :tabindex="tabIndex">
        <slot />
        <div class="blocked" v-if="blocked"></div>
    </button>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { defineComponent } from 'vue';

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
                if (props.blocked) return 'button-blocked';
                return 'button';
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.button {
    color: $color-text-second;
    position: relative;
    font-size: 1rem;
    @include material(3);
    @include z-depth-transition();

    &:hover {
        cursor: pointer;
        color: $color-text-main;
        @include material(4);
    }

    &:focus {
        color: $color-text-main;
        outline: 2px solid $color-outline-dark;
        @include material(4);
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

.button-blocked {
    color: $color-text-second;
    position: relative;
    font-size: 1rem;
    @include material(3);
    @include z-depth(2);
    @include z-depth-transition();
}
</style>
