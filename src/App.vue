<template>
    <header-vue/>
    <div class="content">
        <router-view />
    </div>

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

import HeaderVue from "@/components/Header.vue";
import MessagePrompt from "@/components/MessagePrompt.vue";
import MessageNotification from "@/components/MessageNotification.vue";
import TransitionFade from "@/components/TransitionFade.vue";
import ScreenInit from "@/components/ScreenInit.vue";
import ProgressBar from "@/components/ProgressBar.vue";

import { usePromptStore } from "@/store/modals/modal-prompt";
import { useProgressBarStore } from "@/store/modals/modal-progress-bar";
import { useInitStore } from "@/store/modals/modal-init";
import { useCollections } from "@/store/collections";

import useSwUpdate from '@/composables/swUpdate'

import fs from "@/modules/file-system";

export default defineComponent({
    components: {
        HeaderVue,
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
        const { listenForSwUpdate } = useSwUpdate();

        listenForSwUpdate();

        onMounted(async () => {
            //console.clear();

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

.content {
    height: 96vh;
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

.tooltip {
    background-color: $color-dark-5;
    border: thin solid $color-border-dark-5;
    color: $color-text-main;
    padding: 5px 7px 5px 7px;
    width: max-content;
    max-width: 50vw;
    transition: opacity 0.5s;
    white-space: pre-line;
    text-align: left;
    --left: 4px;
    --bottom-outer: -10px;
    --bottom-inner: -12px;
    --path: polygon(100% 0, 50% 100%, 0 0);
    @include z-depth();

    

    &::before {
        content: "";
        display: inline-block;
        position: absolute;
        background-color: $color-border-dark-5;
        bottom: var(--bottom-inner);
        left: var(--left);
        width: 12px;
        height: 12px;
        clip-path: var(--path);
    }

    &::after {
        content: "";
        display: inline-block;
        position: absolute;
        background-color: $color-dark-5;
        bottom: var(--bottom-outer);
        left: calc(var(--left) + 1px);
        width: 10px;
        height: 10px;
        clip-path: var(--path);
    }

    p {
        margin: 0;
    }
}
</style>
