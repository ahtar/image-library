<template>
    <transition-group name="fade" appear>
        <div v-for="item in items" :key="(item as any).manifest.id">
            <slot :item="item" />
        </div>
    </transition-group>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    setup() {
        return {};
    },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-enter-active,
.list-leave-active,
.list-move {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translate(10px, -50px);
}

.list-leave-active {
    position: absolute;
}
</style>
