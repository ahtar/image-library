<template>
    <base-card class="card-tag-small" data-test="card-tag-small">
        {{ content }}
    </base-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import BaseCard from '@/components/base/BaseCard.vue';

export default defineComponent({
    props: {
        tag: {
            required: true,
            type: Object as PropType<Tag>,
        },
    },
    components: {
        BaseCard,
    },
    setup(props) {
        const name = computed(() => {
            if (props.tag) {
                if (typeof props.tag == 'string') {
                    return 'Error';
                } else {
                    return props.tag.name;
                }
            }
            return 'Error';
        });
        const count = computed(() => {
            if (props.tag) {
                if (typeof props.tag == 'string') {
                    return '0';
                } else {
                    return props.tag.count;
                }
            }
            return '0';
        });

        const content = computed(() => {
            return `${name.value} (${count.value})`;
        });

        return {
            content,
        };
    },
});
</script>

<style lang="scss" scoped>
.card-tag-small {
    font-size: 1rem;
    padding: 5px;
}
</style>
