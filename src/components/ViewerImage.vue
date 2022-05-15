<template>
    <div class="viewer-image-wrapper">
        <img alt="Image" ref="img">
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import useRerenderImage from '@/composables/image-rendering'

export default defineComponent({
    props: {
        image: {
            required: true
        }
    },
    setup(props) {
        const { renderImage } = useRerenderImage();
        const img = ref<HTMLImageElement | null>(null);
        const image = ref(props.image as ImageSingle);

        onMounted(async () => {
            if(img.value != null) {
                await renderImage(img.value, await image.value.getImage());
            }
        });

        onUpdated(async () => {
            if(img.value != null) {
                console.log(image.value.manifest.id)
                await renderImage(img.value, await image.value.getImage());
                console.log('puk');
            }
        });

        function scale() {
            if(img.value) {
                console.log(img.value.naturalWidth);
                console.log(img.value.naturalHeight);
            }
        }

        return {
            img
        }
    },
})
</script>

<style lang="scss" scoped>
    .viewer-image-wrapper {
        img {
            max-width: 95vw;
            max-height: 95vh;
        }
    }
</style>
