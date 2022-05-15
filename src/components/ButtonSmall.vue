<template>
    <base-button class="button-small">
        <slot/>
    </base-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

export default defineComponent({
    components: {
        BaseButton
    },
    setup() {
        return {
        }
    },
})
</script>


<style lang="scss" scoped>
    .button-small {
        height: 2rem;
    }
</style>