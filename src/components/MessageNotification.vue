<template>
    <div class="notification-container">
        <transition-fade v-for="(notification, i) in store.activeNotifications" :key="i">
            <card-notificaton-success :message="notification.message" @close="close(notification)"
                v-if="notification.status" />
            <card-notification-error :message="notification.message" @close="close(notification)" v-else />
        </transition-fade>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TransitionFade from "@/components/TransitionFade.vue";
import CardNotificatonSuccess from "@/components/CardNotificationSuccess.vue";
import CardNotificationError from "@/components/CardNotificationError.vue";

import { useNotificationStore } from "@/store/modals/modal-notification";

export default defineComponent({
    components: {
        TransitionFade,
        CardNotificatonSuccess,
        CardNotificationError,
    },
    setup() {
        const store = useNotificationStore();
        return {
            store,
            close(notification: any) {
                store.removeNotification(notification);
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.notification-container {
    position: absolute;
    top: 10px;
    right: 10px;
    @include flex-column();
}
</style>
