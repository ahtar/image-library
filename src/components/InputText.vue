<template>
    <div class="input-wrapper" :class="{'input-wrapper-textarea': textarea}">
        <div class="label" :class="{'important': important, 'label-textarea': textarea}" v-if="labelActive()">{{label}}</div>
        <div class="input-textarea" v-if="textarea">
            <textarea :placeholder="placeholder" :value="modelValue" @input="input"/>
        </div>
        <div class="input-text" v-else>
            <input type="text" 
                class="focusable"
                :placeholder="placeholder" 
                :value="modelValue" @input="input" 
                @keydown.down="quickSuggestion" 
                :disabled="active != true" 
                :tabindex="tabIndex"
                @keypress.enter="enterKeypress"/>
        </div>
        <div class="wrapper-disabled" v-if="!active"/>
    </div>
</template>


<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
    props: {
        label: {
            type: String
        },
        important: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: 'placeholder'
        },
        modelValue: String,
        active: {
            type: Boolean,
            default: true
        },
        tabindex: {
            type: Number,
            default: 0
        },
        textarea: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:modelValue', 'enterKey', 'quickSuggestion'],

    setup(props, { emit }) {

        const tabIndex = computed(() => {
            if(props.active == true) {
                return props.tabindex;
            } else {
                return -1;
            }
        });

        function labelActive() {
            if(props.label) return true;
            return false;
        }

        function input(value: InputEvent) {
            emit('update:modelValue', (value.target as HTMLInputElement).value);
        }

        function enterKeypress(value: InputEvent) {
            emit('enterKey');
        }

        function quickSuggestion() {
            emit('quickSuggestion');
        }


        return {
            labelActive,
            input,
            enterKeypress,
            quickSuggestion,
            tabIndex,
        }
    },
})
</script>

<style lang="scss" scoped>
    .input-wrapper {
        position: relative;
        border-radius: $radius-big;
        overflow: hidden;
        margin: $margin-big;
        background-color: $color-dark-2;
        border: thin solid $color-border-dark-2;
        height: 2rem;
        @include z-depth(2);
        @include flex;
        flex-wrap: nowrap;

        .input-text {
            padding: $padding-big;
            width: 98%;

            input {
                outline: none;
                border: none;
                height: 95%;
                width: 100%;
                font-size: 1rem;
                color: $color-text-main;
                background-color: transparent;
                @include focus();
                &::placeholder {
                    color:$color-text-second;
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
                @include focus();
                @include scroll();
                &::placeholder {
                    color:$color-text-second;
                }
            }
        }

        .label {
            font-size: 1rem;
            padding: $padding-big;
            color:$color-text-second;
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

    .input-wrapper-textarea {
        flex-direction: column;
        .label-textarea {
            border-bottom: thin solid $color-border-dark-4;
            border-right: none;
        }
    }
</style>