<template>
    <div class="context-menu" @blur="closeContext" ref="menu" tabindex="0" @contextmenu.prevent>
        <slot class="option">
            <div class="option">test 1</div>
            <div class="option">test 2</div>
            <div class="option">test 3</div>
            <div class="option">test 4</div>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";

export default defineComponent({
    props: {
        event: {
            type: MouseEvent,
            required: true,
        },
    },

    emits: ["close"],

    setup(props, { emit }) {
        const menu = ref<HTMLElement | null>(null);

        //сфокусироваться на меню
        onMounted(() => {
            //рассчитать Y координату с учётом границ экрана
            if (
                props.event.clientY + menu.value!.offsetHeight >
                document.body.clientHeight
            ) {
                menu.value!.style.top = `${props.event.clientY - menu.value!.offsetHeight
                    }px`;
            } else {
                menu.value!.style.top = `${props.event.clientY}px`;
            }

            //рассчитать X координату с учётом границ экрана
            if (
                props.event.clientX + menu.value!.offsetWidth >
                document.body.clientWidth
            ) {
                menu.value!.style.left = `${props.event.clientX - menu.value!.offsetWidth
                    }px`;
            } else {
                menu.value!.style.left = `${props.event.clientX}px`;
            }

            //Сфокусироваться на меню.
            nextTick(() => {
                menu.value?.focus();
            });
        });

        return {
            menu,
            closeContext() {
                emit("close");
            },
            blur,
        };
    },
});
</script>

<style lang="scss" scoped>
.context-menu {
    min-width: 100px;
    position: fixed;
    position: absolute;
    border: thin solid $color-border-dark-4;
    @include z-depth();
    @include flex-column();
}

::v-slotted(div) {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 8px 0 8px 0;
    background-color: $color-dark-4;
    border-bottom: thin solid $color-border-dark-5;
    color: $color-text-main;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: $color-dark-6;
    }
}
</style>
