<template>
    <base-card class="card-tag-small">
        {{name()}} ({{count()}})
    </base-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'

export default defineComponent({
    props: {
        tag: {
            required: true,
            type: Object as PropType<Tag>
        }
    },
    components: {
        BaseCard
    },
    setup(props) {
        function name() {
            if(props.tag) {
                if(typeof props.tag == 'string') {
                    return 'Error'
                } else {
                    return props.tag.name;
                }
            }
            return null
        }

        function count() {
            if(props.tag) {
                if(typeof props.tag == 'string') {
                    return '0'
                } else {
                    return props.tag.count;
                }
            }
            return null
        }

        return {
            name,
            count
        }
    }
})
</script>

<style lang="scss" scoped>
    .card-tag-small {
        font-size: 1rem;
        padding: 5px;
    }
</style>