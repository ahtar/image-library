<template>
    <base-modal class="modal-dark">
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
})
</script>
<style lang="scss" scoped>
    .modal-dark {
        background-color: $color-shadow;
        flex-wrap: nowrap;
    }
</style>