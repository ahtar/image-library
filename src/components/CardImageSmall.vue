<template>
    <base-card class="card-image-small">
        <img ref="imgRef" src="@/assets/Error.png">
        <div class="set-symbol" v-if="isSet()" data-test="card-image-small-set"/>
    </base-card>
</template>


<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, onUnmounted, onUpdated, PropType, ref } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'

import useImageRendering from '@/composables/image-rendering'

export default defineComponent({
    props: {
        image: {
            required: true,
            type: Object as PropType<ImageSingle | ImageSet>
        }
    },
    components: {
        BaseCard,
    },
    setup(props) {
        const { renderImage, releaseImage } = useImageRendering();

        const imgRef = ref<null | HTMLImageElement>(null);

        let cachedId = '';


        //Прорисовка изображения при mounted.
        onMounted(async () => {
            try {
                let file: any;
                if('arr' in props.image) {
                    cachedId = props.image.arr[0].manifest.id;
                    file = await props.image.arr[0].getThumbnail();
                } else {
                    cachedId = props.image.manifest.id;
                    file = await props.image.getThumbnail();
                }
                imgRef.value!.style.width = 'auto';
                imgRef.value!.style.height = 'auto';
                releaseImage(imgRef.value!);
                await renderImage(imgRef.value!, file);
            } catch(err) {
                console.log(err);
            }
        });

        //Прорисовка изображения при updated.
        onUpdated(async () => {
            try {
                let id = '';
                let file: any;

                if('arr' in props.image) {
                    id = props.image.arr[0].manifest.id;
                    file = await props.image.arr[0].getThumbnail();
                } else {
                    id = props.image.manifest.id;
                    file = await props.image.getThumbnail();
                }

                if(cachedId != id) {
                    releaseImage(imgRef.value!);
                    renderImage(imgRef.value!, file);
                    imgRef.value!.style.width = 'auto';
                    imgRef.value!.style.height = 'auto';
                    cachedId = id;
                }
            } catch(err) {
                console.log(err);
            }
        });

        onBeforeUnmount(() => {
            releaseImage(imgRef.value!);
        })

        function isSet() {
           return 'arr' in props.image
        }
        
        return {
            imgRef,
            isSet,
        }
    },
})
</script>

<style lang="scss" scoped>
    .card-image-small {
        position: relative;
        margin: 10px;

        img {
            max-width: 150px;
            max-height: 250px;
            height: 190px;
            width: 140px;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
        }

        .set-symbol {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            height: 20px;
            background-color: #3d6b96;
            box-shadow: 4px -4px #31506d, 8px -8px #2e465c;
        }

        .selected {
            outline: 3px solid rgb(95, 168, 228);
        }
    }
</style>
