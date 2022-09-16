/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log(
                "App is being served from cache by a service worker.\n" +
                "For more details, visit https://goo.gl/AFskqB"
            );
        },
        registered() {
            console.log("Service worker has been registered.");
        },
        cached() {
            console.log("Content has been cached for offline use.");
        },
        updatefound() {
            console.log("New content is downloading.");
        },
        updated(registration) {
            console.log("New content is available; please refresh.");
            //dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip

            /**
             * при получении нового ServiceWorkerRegistration объекта
             * отправить событие swUpdated с этим ServiceWorkerRegistration
             * для последующей активации нового serviceWorker
             */
            document.dispatchEvent(
                new CustomEvent('swUpdated', { detail: registration })
            )
        },
        offline() {
            console.log(
                "No internet connection found. App is running in offline mode."
            );
        },
        error(error) {
            console.error("Error during service worker registration:", error);
        },
    });
}
