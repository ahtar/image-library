<template>
    <div class="card-notification-success" data-test="card-notification-success" @click="close">
        <div class="success"></div>
        <div class="notification">
            <div class="title">{{t('NOTIFICATION.TITLE.SUCCESS')}}</div>
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
.card-notification-success {
    display: flex;
    font-size: 1.5rem;
    min-width: 20vw;
    overflow: hidden;
    min-height: 5vh;
    margin: 5px;
    color: $color-text-main;
    @include material(4);

    .success {
        background-color: $color-success;
        width: 20%;
    }

    .notification {
        flex-grow: 1;
        @include flex-column();

        .title {
            color: $color-success;
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
