<template>
    <modal-dark data-test="screen-init">
        <div class="init-wrapper" v-if="compatibility">
            <p>{{ t('INIT_SCREEN.MESSAGE') }}</p>
            <button-small @click="getCollections()">
                {{ t('BUTTON.PICK_FOLDER') }}</button-small
            >
        </div>
        <div class="init-wrapper" v-else>
            <h3>{{ t('INIT_SCREEN.BROWSER_INCOMPATIBLE') }}</h3>
            <p>{{ t('INIT_SCREEN.INCOMPATIBILITY_DESCRIPTION') }}</p>
            <p>{{ t('INIT_SCREEN.SUPPORTED_BROWSERS') }}</p>
            <img src="@/assets/Incompatible.svg" class="icon" />
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useInitStore } from '@/store/modals/modal-init';
import { useSettings } from '@/store/settings';
import { useCollections } from '@/store/collections';

import ModalDark from '@/components/ModalDark.vue';
import ButtonSmall from '@/components/ButtonSmall.vue';

export default defineComponent({
    components: {
        ModalDark,
        ButtonSmall,
    },
    setup() {
        const store = useInitStore();
        const storeSettings = useSettings();
        const storeCollections = useCollections();
        const compatibility = ref(true);
        const { t } = useI18n();

        async function getCollections() {
            try {
                const handle = await storeSettings.getDirectoryHandle();
                await storeCollections.loadCollections(handle);
                store.hide();
            } catch (err) {
                const error = err as Error;
                if (
                    !(
                        error.name == 'AbortError' &&
                        error.message == 'The user aborted a request.'
                    )
                ) {
                    console.log(error);
                    throw error;
                }
            }
        }

        onBeforeMount(() => {
            compatibility.value = store.checkCompatibility;
        });

        return {
            compatibility,
            getCollections,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.init-wrapper {
    padding: 10px;
    max-width: 40vw;
    color: $color-text-main;
    font-size: 1.5rem;
    white-space: pre-line;
    flex-direction: column;
    @include material(1);
    @include flex-center();

    @media (max-width: #{$bp-small}) {
        width: 100%;
        height: 100%;
        max-width: none;
    }

    .icon {
        width: 20%;
        margin: 10%;
    }
}
</style>
