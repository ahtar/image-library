import { ref } from 'vue'

//dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip

/**
 * TODO
 * оповещение пользователя о наличии обновления
 * и запрос об перезагрузке страницы
 */

export default function () {
    const serviceWorkerRegistration = ref<ServiceWorkerRegistration>();
    const refreshing = ref(false);

    /**
     * Следить за обновлением serviceWorker
     * и при наличии обновления перезагрузить страницу
     */
    function listenForSwUpdate() {
        document.addEventListener('swUpdated', (e: any) => {
            serviceWorkerRegistration.value = e.detail as ServiceWorkerRegistration;
            refreshApp();
        }, { once: true });

        //при смене serviceWorker перезагрузить страницу
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing.value) return;
            refreshing.value = true;
            window.location.reload();
        })
    }

    /**
     * Отправить serviceWorker сообщение SKIP_WAITING и активировать новый serviceWorker
     */
    function refreshApp() {
        //Отправить SKIP_WAITING только когда serviceWorker в ожидании
        if (!serviceWorkerRegistration.value || !serviceWorkerRegistration.value.waiting) return;
        serviceWorkerRegistration.value.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    return {
        listenForSwUpdate
    }
}