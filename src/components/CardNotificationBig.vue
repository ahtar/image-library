<template>
    <div class="wrapper" @click="close">
        <div class="success" v-if="status"></div>
        <div class="error" v-else></div>
        <div class="notification">{{message}}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        message: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true,
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        return {
            close() {
                emit('close');
            }
        }
    },
})
</script>


<style lang="scss" scoped>
    .wrapper {
        display: flex;
        background-color: #597087;
        border: thin solid $color-border-dark-4;
        font-size: 1.5rem;
        min-width: 20vw;
        border-radius: 8px;
        overflow: hidden;
        min-height: 5vh;
        margin: 5px;
        color: $color-text-main;
        @include z-depth(2);

        .success {
            background-color: rgb(78, 202, 115);
            width: 20%;
        }

        .error {
            background-color: rgb(194, 83, 68);
            width: 20%;
        }

        .notification {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
        }

        &:hover {
            cursor: pointer;
            @include focus();
        }
    }
</style>