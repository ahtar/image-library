<template>
    <modal-dark>
        <div class="progress-bar-wrapper">
            <base-progress-bar
                class="progress-bar"
                :value="store.value"
                :max="store.max"
            />
            <p>({{ store.value }}/{{ store.max }})</p>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ModalDark from '@/components/ModalDark.vue';
import BaseProgressBar from '@/components/base/BaseProgressBar.vue';

import { useProgressBarStore } from '@/store/modals/modal-progress-bar';

export default defineComponent({
    components: {
        ModalDark,
        BaseProgressBar,
    },

    setup() {
        const store = useProgressBarStore();

        return {
            store,
        };
    },
});
</script>
<style lang="scss" scoped>
.progress-bar-wrapper {
    color: $color-text-main;
    font-size: 1.4rem;
    padding: 7px;
    @include material(1);
    @include flex-column();

    .progress-bar {
        width: 30vw;
    }
}
</style>
