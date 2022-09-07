<template>
    <div class="card-notification-error" data-test="card-notification-error" @click="close">
        <div class="error"></div>
        <div class="notification">
            <div class="title">{{ t('NOTIFICATION.TITLE.ERROR') }}</div>
            <div class="message">{{ message }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
    props: {
        message: {
            type: String,
            required: true,
        },
    },
    emits: ["close"],
    setup(props, { emit }) {
        const { t } = useI18n();
        return {
            close() {
                emit("close");
            },
            t
        };
    },
});
</script>

<style lang="scss" scoped>
.card-notification-error {
    display: flex;
    font-size: 1.5rem;
    min-width: 17vw;
    overflow: hidden;
    min-height: 5vh;
    margin: 5px;
    color: $color-text-main;
    @include material(4);

    .error {
        background-color: $color-error;
        width: 20%;
    }

    .notification {
        flex-grow: 1;
        @include flex-column();

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
