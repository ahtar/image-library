<template>
    <div
        class="input-wrapper"
        :class="{
            'input-wrapper-textarea': textarea,
            'input-focused': focused,
        }"
    >
        <div
            class="label"
            :class="{ important: important, 'label-textarea': textarea }"
            v-if="labelActive"
            data-test="input-text-label"
        >
            {{ label }}
        </div>
        <div class="input-textarea" v-if="textarea">
            <textarea
                :placeholder="placeholder"
                :value="modelValue"
                @input="input"
                @focus="focus"
                @blur="unfocus"
            />
        </div>
        <div class="input-text" v-else>
            <input
                type="text"
                class="focusable"
                :placeholder="placeholder"
                :value="modelValue"
                @input="input"
                @keydown.down="quickSuggestion"
                :disabled="active != true"
                :tabindex="tabIndex"
                @keypress.enter="enterKeypress"
                @focus="focus"
                @blur="unfocus"
            />
        </div>
        <div
            class="wrapper-disabled"
            v-if="!active"
            data-test="input-test-disabled"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        /**
         * Описание поля
         */
        label: {
            type: String,
        },

        /**
         * Имеет ли поле важное значение
         */
        important: {
            type: Boolean,
            default: false,
        },

        placeholder: {
            type: String,
            default: '',
        },

        modelValue: String,

        /**
         * Активно ли поле
         */
        active: {
            type: Boolean,
            default: true,
        },
        tabindex: {
            type: Number,
            default: 0,
        },

        /**
         * Является ли поле textarea
         */
        textarea: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['update:modelValue', 'enterKey', 'quickSuggestion'],

    setup(props, { emit }) {
        const focused = ref(false);

        const tabIndex = computed(() => {
            if (props.active == true) {
                return props.tabindex;
            } else {
                return -1;
            }
        });

        const labelActive = computed(() => {
            if (props.label) return true;
            return false;
        });

        function input(value: Event) {
            emit('update:modelValue', (value.target as HTMLInputElement).value);
        }

        function enterKeypress() {
            emit('enterKey');
        }

        function quickSuggestion() {
            emit('quickSuggestion');
        }

        function focus() {
            focused.value = true;
        }

        function unfocus() {
            focused.value = false;
        }

        return {
            labelActive,
            input,
            enterKeypress,
            quickSuggestion,
            tabIndex,
            focus,
            unfocus,
            focused,
        };
    },
});
</script>

<style lang="scss" scoped>
.input-wrapper {
    position: relative;
    overflow: hidden;
    height: 2rem;
    flex-wrap: nowrap;
    align-items: stretch;
    display: flex;
    @include material(2);

    .input-text {
        flex-grow: 1;
        display: flex;

        input {
            outline: none;
            border: none;
            font-size: 1rem;
            color: $color-text-main;
            height: 100%;
            flex-grow: 1;
            background-color: transparent;

            @include input-placeholder {
                color: $color-text-second;
            }
        }
    }

    .input-textarea {
        flex-grow: 1;
        width: 100%;

        textarea {
            outline: none;
            border: none;
            height: 100%;
            width: 100%;
            font-size: 1rem;
            color: $color-text-main;
            background-color: transparent;
            resize: none;
            @include scroll();

            @include input-placeholder {
                color: $color-text-second;
            }
        }
    }

    .label {
        font-size: 1rem;
        padding: $padding-big;
        color: $color-text-second;
        border-right: thin solid $color-border-dark-4;
        font-weight: bold;
        display: flex;
        align-items: center;
    }

    .important {
        background-color: $color-dark-4;
        border-right: none;
        color: $color-text-main;
    }

    .wrapper-disabled {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: $color-shadow;
    }
}

.input-focused {
    outline: 1px solid $color-outline-dark;
    @include z-depth-focus();
}

.input-wrapper-textarea {
    flex-direction: column;

    .label-textarea {
        border-bottom: thin solid $color-border-dark-4;
        border-right: none;
    }
}
</style>
