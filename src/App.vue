<template>
    <header-vue />
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

    <transition-fade>
        <form-settings v-if="storeSettings.visible" />
    </transition-fade>

    <screen-init v-if="storeInit.visible" @data="addCollections" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import HeaderVue from '@/components/Header.vue';
import MessagePrompt from '@/components/MessagePrompt.vue';
import MessageNotification from '@/components/MessageNotification.vue';
import TransitionFade from '@/components/TransitionFade.vue';
import ScreenInit from '@/components/ScreenInit.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import FormSettings from './components/FormSettings.vue';

//import { useModalStore } from '@/store/modals/store';
import { usePromptStore } from '@/store/modals/modal-prompt';
import { useProgressBarStore } from '@/store/modals/modal-progress-bar';
import { useInitStore } from '@/store/modals/modal-init';
import { useCollections } from '@/store/collections';
import { useSettings } from '@/store/settings';

import useSwUpdate from '@/composables/swUpdate';
import useStoreWatch from '@/composables/storeWatch';

export default defineComponent({
    components: {
        HeaderVue,
        MessageNotification,
        MessagePrompt,
        TransitionFade,
        ScreenInit,
        ProgressBar,
        FormSettings,
    },
    setup() {
        //const storeModal = useModalStore();
        const storePrompt = usePromptStore();
        const storeProgressBar = useProgressBarStore();
        const storeInit = useInitStore();
        const storeCollections = useCollections();
        const storeSettings = useSettings();
        const { listenForSwUpdate } = useSwUpdate();
        const { watchSettings } = useStoreWatch();

        listenForSwUpdate();

        onMounted(async () => {
            await storeSettings.loadSettings();
            storeSettings.setupLanguage();
            watchSettings();

            //Если directoryHandle получен из idb и разрешение
            // на чтение и запись предоставленно, то загрузить коллекции
            if (
                storeSettings.directoryHandle &&
                (await storeSettings.verifyPermission())
            ) {
                await storeCollections.loadCollections(
                    storeSettings.directoryHandle
                );
            }

            //если коллекции не загруженны, то отобразить окно init
            if (!storeCollections.collectionsInitialized) {
                storeInit.show();
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
            storeSettings,
            addCollections,
        };
    },
});
</script>

<style lang="scss">
/*html {
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
}*/

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
        content: '';
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
        content: '';
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
