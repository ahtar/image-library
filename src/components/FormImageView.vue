<template>
    <modal-dark @close="close">
        <div class="select-wrapper wrapper" v-if="isSet()">
            <select-image :set="image?.arr" @change="changeImage"/>
        </div>
        <div class="image-wrapper wrapper">
           <img id="image-view" ref="img"/>
           <!--<viewer-image :image="renderedImage"/> -->
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, ref, render } from 'vue'
import ModalDark from '@/components/ModalDark.vue'
import SelectImage from '@/components/SelectImage.vue'
import ViewerImage from '@/components/ViewerImage.vue'
import { useImageViewStore } from '@/store/forms/form-image-view';
import useRerenderImage from '@/composables/image-rendering'

export default defineComponent({
    components: {
        ModalDark,
        SelectImage,
        //ViewerImage,
    },
    setup() {
        const store = useImageViewStore();
        const { renderImage } = useRerenderImage();

        const img = ref<null | HTMLImageElement>(null);

        const renderedImage = ref<ImageSingle | null>(null);

       /* onBeforeMount(() => {
            if('arr' in store.image!) {
                renderedImage.value = store.image.arr[0];
            } else {
                renderedImage.value = store.image;
            }
        });*/

        onMounted(async () => {

            if(store.image) {
                if('set' in store.image.manifest) {
                    renderImage(img.value!, await (store.image as ImageSet).arr[0].getImage());
                } else {
                    renderImage(img.value!,  await (store.image as ImageSingle).getImage());
                }
            }
        });

        function isSet() {
            if('set' in store.image!.manifest) {
                return true;
            } else {
                return false;
            }
        }

        async function changeImage(image: ImageSingle) {
            /*console.info('change', image.manifest.id);
            renderedImage.value = image;*/
            renderImage(img.value!,  await image.getImage());
        }
        
        return {
            close: store.close,
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
    #image-view {
        max-height: 95vh;
        max-width: 95vw;
    }

    .select-wrapper {
        margin-left: 1vw;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .image-wrapper {
        margin-right: 3vw;
        max-height: 95vh;
        overflow: hidden;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>