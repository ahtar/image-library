<template>
    <div class="card-notification-big" data-test="card-notification-big" @click="close">
        <div class="success" v-if="status"></div>
        <div class="error" v-else></div>
        <div class="notification">{{ message }}</div>
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
        status: {
            type: Boolean,
            default: true,
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
.card-notification-big {
    display: flex;
    overflow: hidden;
    color: $color-text-main;
    font-size: 1.5rem;
    min-width: 20vw;
    min-height: 5vh;
    margin: 5px;
    @include material(4);

    .success {
        background-color: rgb(78, 202, 115);
        width: 20%;
    }

    .error {
        background-color: rgb(194, 83, 68);
        width: 20%;
    }

    .notification {
        @include flex-center();
        flex-grow: 1;
    }

    &:hover {
        cursor: pointer;
        @include focus();
    }
}
</style>
