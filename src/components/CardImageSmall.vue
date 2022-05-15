<template>
    <base-card class="card-image-small">
        <img ref="imgRef">
        <div class="set-symbol" v-if="isSet()"/>
    </base-card>
</template>


<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'

import useImageRendering from '@/composables/image-rendering'

export default defineComponent({
    props: {
        image: {
            required: true
        }
    },
    components: {
        BaseCard,
    },
    setup(props) {
        const { renderImage } = useImageRendering();

        const imgRef = ref<null | HTMLImageElement>(null);


        onMounted(async () => {
            try {
                const image = props.image as ImageSingle | ImageSet;
                if('set' in image.manifest) {
                    const file = await (image as ImageSet).arr[0].getThumbnail();
                    renderImage(imgRef.value!, file);
                } else {
                    const file = await (image as ImageSingle).getThumbnail();
                    renderImage(imgRef.value!, file);
                }
            } catch(err) {
                console.log(err);
                renderImage(imgRef.value!, `${process.env.BASE_URL}/Error.png`);
            }
        });

        onUpdated(async () => {
            try {
                const image = props.image as ImageSingle | ImageSet;
                if('set' in image.manifest) {
                    const file = await (image as ImageSet).arr[0].getThumbnail();
                    renderImage(imgRef.value!, file);
                } else {
                    const file = await (image as ImageSingle).getThumbnail();
                    renderImage(imgRef.value!, file);
                }
            } catch(err) {
                console.log(err);
                renderImage(imgRef.value!, `${process.env.BASE_URL}/Error.png`);
            }
        });

        function isSet() {
            const image = props.image as ImageSingle | ImageSet;
            return 'set' in image.manifest
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
