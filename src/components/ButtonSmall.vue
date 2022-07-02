<template>
    <base-button class="button-small" :blocked="blocked" @click="click">
        <slot/>
    </base-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

export default defineComponent({
    props: {
        blocked: {
            default: false,
            type: Boolean
        }
    },
    emits: ['click'],

    components: {
        BaseButton
    },
    setup(props, { emit }) {
        return {
            click() {
                if(!props.blocked) {
                    emit('click');
                }
            }
        }
    },
})
</script>


<style lang="scss" scoped>
    .button-small {
        height: 2rem;
    }
</style>