<template>
    <img ref="img">
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect, onUnmounted } from "vue";
import  useImageRendering from '@/composables/image-rendering'

export default defineComponent({
    props: {
        data: {
            type: Object as PropType<Blob | File | FileSystemFileHandle>
        }
    },

    setup(props) {

        const { renderImage } = useImageRendering();

        const img = ref<HTMLImageElement>();

        watchEffect(async () => {
            renderImage(img.value, props.data);
        });

        onUnmounted(() => {
            if (!img.value) return;

            if (img.value.src != '') URL.revokeObjectURL(img.value.src);
        })

        return {
            img
        }
    }
});
</script>