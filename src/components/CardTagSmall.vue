<template>
    <base-card class="card-tag-small">
        <slot/>
    </base-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'

export default defineComponent({
    components: {
        BaseCard
    },
})
</script>

<style lang="scss" scoped>
    .card-tag-small {
        font-size: 1rem;
        padding: 5px;
    }
</style>