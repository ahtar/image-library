<template>
    <modal-dark @close="close" data-test="form-view-close">
        <div class="select-wrapper wrapper" v-if="isSet">
            <select-image :set="(image as ImageSet).arr" @change="changeImage" data-test="form-view-select"/>
        </div>
        <div class="image-wrapper wrapper">
           <viewer-image :image="renderedImage!" data-test="form-view-viewer"/>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, computed } from 'vue'
import ModalDark from '@/components/ModalDark.vue'
import SelectImage from '@/components/SelectImage.vue'
import ViewerImage from '@/components/ViewerImage.vue'
import { useImageViewStore } from '@/store/forms/form-image-view';

export default defineComponent({
    components: {
        ModalDark,
        SelectImage,
        ViewerImage,
    },
    setup() {
        const store = useImageViewStore();

        const img = ref<null | HTMLImageElement>(null);
        const renderedImage = ref<ImageSingle | null>(null);
        const isSet = computed(() => {
            if('set' in store.image!.manifest) {
                return true;
            } else {
                return false;
            }
        });

        onBeforeMount(() => {
            if('arr' in store.image!) {
                renderedImage.value = store.image.arr[0];
            } else {
                renderedImage.value = store.image;
            }
        });

        async function changeImage(image: ImageSingle) {
            renderedImage.value = image;
        }
        
        return {
            close() {
                store.close();
            },
            image: store.image,
            renderedImage,
            img,
            isSet,
            changeImage,
        }
    },
})
</script>

<style lang="scss" scoped>
    .select-wrapper {
        margin-left: 1vw;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .image-wrapper {
        margin-right: 3vw;
        height: 95vh;
        width: 95vw;
        max-width: 95vw;
        max-height: 95vh;
        overflow: hidden;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>