<template>
    <div class="sidebar" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" ref="sidebar">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
    emits: ['unfocus'],
    setup(props, { emit } ) {
        const sidebar = ref<HTMLElement | null>(null);

        /**
         * Список всех фокусируемых элементов Sidebar.
         */
        const elements: Array<HTMLElement> = [];
        onMounted(() => {
            elements.push(...sidebar.value!.querySelectorAll<HTMLElement>('.focusable'));
            disable();
        });

        /**
         * Отключение фокуса для элементов Sidebar.
         */
        function disable() {
            elements.forEach((element) => {
                element.tabIndex = -1;
                element.blur();
            });
        }

        /**
         * Включение фокуса для элементов Sidebar.
         */
        function enable() {
            elements.forEach((element) => {
                element.tabIndex = 0;
            });
        }



        return {
            onMouseEnter() {
                if(sidebar.value != null) {
                    enable();
                    sidebar.value.style.transform = 'translate(0, 0)';
                    sidebar.value.style.transition = '0.35s ease-out';
                }
             },
             onMouseLeave() {
                 if(sidebar.value != null) {
                    disable();
                    sidebar.value.style.transform = 'translateX(-100%) translateX(+1.5vw)';
                    sidebar.value.style.transition = '0.35s ease-in';

                    emit('unfocus');
                }
             },

             sidebar,
             blur
        }
    },
})
</script>


<style lang="scss" scoped>
    .sidebar {
        z-index: 5;
        position: fixed;
        height: 100vh;
        width: 10vw;
        padding: 25px 2vw 0 1.5vw ;
        background-color: $color-dark-1;
        border-right: thin solid $color-border-dark-1;
        transform:  translateX(-100%) translateX(+1.5vw);
        transition: 0.35s ease-in;
        @include z-depth(4);
        display: flex;
        flex-direction: column;
        align-items: center;

        ::v-slotted(div) {
            margin-top: 25px;
        }
        ::v-slotted(button) {
            margin-top: 25px;
        }
    }
</style>