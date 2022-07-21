<template>
    <div class="wrapper" @click="close">
        <div class="error"></div>
        <div class="notification">
            <div class="title">Error</div>
            <div class="message">{{ message }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        message: {
            type: String,
            required: true,
        },
    },
    emits: ["close"],
    setup(props, { emit }) {
        return {
            close() {
                emit("close");
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    background-color: $color-dark-4;
    font-size: 1.5rem;
    min-width: 17vw;
    border-radius: 8px;
    overflow: hidden;
    min-height: 5vh;
    margin: 5px;
    color: $color-text-main;
    @include z-depth(2);

    .error {
        background-color: $color-error;
        width: 20%;
    }

    .notification {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .title {
            color: $color-error;
            font-size: 1rem;
        }

        .message {
            flex-grow: 1;
        }
    }

    &:hover {
        cursor: pointer;
        @include focus();
    }
}
</style>
