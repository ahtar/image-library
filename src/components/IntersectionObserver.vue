<template>
    <div id="observer" ref="observerRef"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
    emits: ['update'],
    setup(props, { emit }) {
        const observerRef = ref<Element | null>(null);
        let observer: IntersectionObserver;

        onMounted(() => {
            if (observerRef.value) {
                observer = new IntersectionObserver(callback, options);
                observer.observe(observerRef.value);
            }
        });

        function callback(event: IntersectionObserverEntry[]) {
            emit('update', event[0].isIntersecting == true);
        }

        function checkIntersection() {
            if (observerRef.value) {
                observer.unobserve(observerRef.value);
                observer.observe(observerRef.value);
            }
        }

        const options = {
            rootMargin: `40%`,
        };

        return {
            observerRef,
            checkIntersection,
        };
    },
});
</script>
