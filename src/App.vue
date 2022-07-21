<template>
    <router-view />

    <message-notification />

    <transition-fade>
        <message-prompt v-if="storePrompt.visible" />
    </transition-fade>

    <transition-fade>
        <progress-bar v-if="storeProgressBar.visible" />
    </transition-fade>

    <screen-init v-if="storeInit.visible" @data="addCollections" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

import MessagePrompt from "@/components/MessagePrompt.vue";
import MessageNotification from "@/components/MessageNotification.vue";
import TransitionFade from "@/components/TransitionFade.vue";
import ScreenInit from "@/components/ScreenInit.vue";
import ProgressBar from "@/components/ProgressBar.vue";

import { usePromptStore } from "@/store/modals/modal-prompt";
import { useProgressBarStore } from "@/store/modals/modal-progress-bar";
import { useInitStore } from "@/store/modals/modal-init";
import { useCollections } from "@/store/collections";

import fs from "@/modules/file-system";

export default defineComponent({
    components: {
        MessageNotification,
        MessagePrompt,
        TransitionFade,
        ScreenInit,
        ProgressBar,
    },
    setup() {
        const storePrompt = usePromptStore();
        const storeProgressBar = useProgressBarStore();
        const storeInit = useInitStore();
        const storeCollections = useCollections();
        const { checkMainFolderAccess, initLoadCollections } = fs;

        onMounted(async () => {
            console.clear();

            //Проверка, загруженны ли коллекции, если не загружены, то запросить доступ к коллекциям.
            if (!storeCollections.collectionsInitialized) {
                const status = await checkMainFolderAccess();
                if (!status) {
                    storeInit.show();
                } else {
                    const data = await initLoadCollections();
                    storeCollections.addCollection(data);
                }
            }
        });

        function addCollections(data: Collection[]) {
            storeCollections.addCollection(data);
            storeInit.hide();
        }

        return {
            storePrompt,
            storeProgressBar,
            storeInit,
            addCollections,
        };
    },
});
</script>

<style lang="scss">
html {
    font-size: $base-font-size * 0.6;
    line-height: $base-line-height;

    @media #{$mq-medium} {
        font-size: $base-font-size * 0.8;
        line-height: $base-line-height;
    }

    @media #{$mq-large} {
        font-size: $base-font-size;
    }

    @media #{$mq-xlarge} {
        font-size: $base-font-size * 1.5;
    }

    @media #{$mq-xxlarge} {
        font-size: $base-font-size * 2;
    }
}

body {
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    background-color: $color-dark-0;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
