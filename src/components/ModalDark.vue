<template>
    <base-modal class="modal-dark" @close="close">
        <slot/>
    </base-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'

export default defineComponent({
    components: {
        BaseModal,
    },
    emits: ['close'],

    setup(props, { emit }) {
        return {
            close() {
                emit('close');
            }
        }
    }
})
</script>
<style lang="scss" scoped>
    .modal-dark {
        background-color: $color-shadow;
        flex-wrap: nowrap;
    }
</style>