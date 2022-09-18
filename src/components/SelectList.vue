<template>
    <div class="select" tabindex="0" @blur="blur" @keyup="keypressHandle">
        <div class="selected" @click="view">{{ selected }}</div>
        <div class="options" ref="optionsRef">
            <div
                class="option"
                :class="{ 'option-selected': activeIndex == i }"
                v-for="(option, i) in data"
                :key="i"
                @click="select(option, i)"
            >
                {{ option[1] }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { defineComponent, ref, PropType, onMounted } from 'vue';

export default defineComponent({
    props: {
        data: {
            required: true,
            type: Array as PropType<Array<[string, string]>>,
        },
        modelValue: String,
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        let visible = false;
        const optionsRef = ref<HTMLElement>();
        const activeIndex = ref<number>();

        const selected = computed(() => {
            const item = props.data.find((item) => item[0] == props.modelValue);
            return item?.[1] || '';
        });

        onMounted(() => {
            const index = props.data.findIndex(
                (item) => item[0] == props.modelValue
            );

            if (index != -1) {
                activeIndex.value = index;
            }
        });

        function keypressHandle(event: KeyboardEvent) {
            if (event.code == 'Enter') view();
            if (event.code == 'KeyS' || event.code == 'ArrowDown') iterate(1);
            if (event.code == 'KeyW' || event.code == 'ArrowUp') iterate(-1);
        }

        function view() {
            if (!optionsRef.value) return;
            if (visible) {
                optionsRef.value.style.display = 'none';
            } else {
                optionsRef.value.style.display = 'block';
            }

            visible = !visible;
        }

        function blur() {
            if (!optionsRef.value) return;
            optionsRef.value.style.display = 'none';
            visible = false;
        }

        function select(option: [string, string], index: number) {
            view();
            activeIndex.value = index;
            emit('update:modelValue', option[0]);
        }

        /**
         * Изменение выбранного элемента из списка элементов
         * @param direction направление выбора, 1 - следующий элемент, -1 - предыдущий элемент
         */
        function iterate(direction: number) {
            if (activeIndex.value === undefined) {
                if (direction == 1) {
                    activeIndex.value = 0;
                } else {
                    activeIndex.value = props.data.length - 1;
                }
            } else {
                if (direction == 1) {
                    if (activeIndex.value < props.data.length - 1) {
                        activeIndex.value++;
                    } else {
                        activeIndex.value = 0;
                    }
                } else {
                    if (activeIndex.value > 0) {
                        activeIndex.value--;
                    } else {
                        activeIndex.value = props.data.length - 1;
                    }
                }
            }
            emit('update:modelValue', props.data[activeIndex.value][0]);
        }

        return {
            optionsRef,
            visible,
            selected,
            activeIndex,

            keypressHandle,
            view,
            blur,
            select,
            iterate,
        };
    },
});
</script>

<style lang="scss" scoped>
.select {
    background-color: $color-dark-1;
    color: $color-text-second;
    position: relative;
    @include focus();

    &:hover {
        cursor: pointer;
    }

    .selected {
        height: 1.5rem;
        padding: 3px 5px 3px 5px;

        &:hover {
            background-color: $color-dark-3;
        }
    }

    .options {
        display: none;
        position: absolute;
        width: 100%;
        top: 100%;
        left: -1px;
        border: thin solid $color-border-dark-2;
        z-index: 5;
        @include z-depth(2);

        .option {
            background-color: $color-dark-2;
            border-bottom: thin solid $color-border-dark-2;
            color: $color-text-second;
            overflow-wrap: break-word;

            &:hover {
                background-color: $color-dark-4;
            }
        }

        .option-selected {
            background-color: $color-dark-5;
        }

        &:last-child {
            border-bottom: none;
        }
    }
}
</style>
