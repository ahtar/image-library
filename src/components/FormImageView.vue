<template>
    <modal-dark @close="close" data-test="form-view-close">
        <div class="select-wrapper wrapper" v-if="store.isSet">
            <select-image
                :set="(image as ImageSet).arr"
                @change="changeImage"
                data-test="form-view-select"
            />
        </div>
        <div class="image-wrapper wrapper">
            <video-player-vue v-if="isVideo" :data="renderedImage" />
            <div class="image-wrapper-w wrapper" v-else>
                <viewer-image
                    :image="renderedImage!"
                    data-test="form-view-viewer"
                />
                <button-small class="button-rotate" @click="rotateImage()">
                    <img src="@/assets/rotate.svg" alt="rotate" />
                </button-small>
            </div>
        </div>
    </modal-dark>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import ModalDark from '@/components/ModalDark.vue';
import SelectImage from '@/components/SelectImage.vue';
import ViewerImage from '@/components/ImageViewer.vue';
import ButtonSmall from './ButtonSmall.vue';
import VideoPlayerVue from './VideoPlayer.vue';
import { useImageViewStore } from '@/store/forms/form-image-view';

export default defineComponent({
    components: {
        ModalDark,
        SelectImage,
        ViewerImage,
        ButtonSmall,
        VideoPlayerVue,
    },
    setup() {
        const store = useImageViewStore();

        const img = ref<null | HTMLImageElement>(null);
        const renderedImage = ref<ImageSingle | null>(null);
        const isVideo = computed(() => {
            if (!renderedImage.value?.manifest.type) return false;
            return /video\/\S*/g.test(renderedImage.value.manifest.type);
        });

        onBeforeMount(() => {
            if (!store.image) return;
            if ('arr' in store.image) {
                renderedImage.value = store.image.arr[0];
            } else {
                renderedImage.value = store.image;
            }
        });

        async function changeImage(image: ImageSingle) {
            renderedImage.value = image;
        }

        function rotateImage(direction = 1) {
            /**
             * Если использовать rotate вместо transform: rotate,
             * то изображение перестает реагировать на клики.
             * баг?
             */
            const img =
                document.querySelector<HTMLImageElement>('#viewed-image');
            if (!img) return;

            if (!img.style.transform) {
                img.style.transform = 'rotate(90deg)';
                return;
            }

            const parsedNumber = Number.parseInt(
                img.style.transform.match(/(\d+)/)?.[0] || '0'
            );
            const number = parsedNumber + 90 * direction;
            img.style.transform = `rotate(${number}deg)`;
        }

        return {
            store,
            close() {
                store.close();
            },
            image: store.image,
            renderedImage,
            img,
            changeImage,
            isVideo,
            rotateImage,
        };
    },
});
</script>

<style lang="scss" scoped>
.select-wrapper {
    margin-left: 1vw;
    @include flex-center-vertical();
}

.image-wrapper {
    margin-right: 6vw;
    height: 95vh;
    width: 93vw;
    max-width: 95vw;
    max-height: 93vh;
    overflow: hidden;
    flex-grow: 1;
    @include flex-center();

    .image-wrapper-w {
        max-height: inherit;
        max-width: inherit;

        .button-rotate {
            position: absolute;
            right: 0;
            bottom: 0;
            margin: 1rem;
            padding: 0.25rem;
            width: fit-content;
            height: fit-content;
            @include flex-center();

            img {
                width: 4vw;
            }
        }
    }
}
</style>
