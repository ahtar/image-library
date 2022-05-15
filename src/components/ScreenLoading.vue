<template>
    <div class="wrapper-loading">
        <spinner :height="128" :width="128" :color="'#497cac'"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Spinner from '@/components/Spinner.vue'

export default defineComponent({
    components: {
        Spinner,
    },
    setup() {
        return {

        }
    },
})
</script>

<style lang="scss" scoped>
    .wrapper-loading {
        width: 100%;
        height: 100%;
        background-color: $color-dark-1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
