<template>
    <div class="input-image" ref="imageField" :tabindex="tabindex">
        <div class="media-wrapper">
            <video-player-vue class="video" :data="fileData" v-if="isVideo" />
            <image-vue :data="imageData" v-else />
        </div>
        <label for="input-file" class="input-file">
            <div class="icon" />
            <p>{{ t('BUTTON.INPUT_FILE') }}</p>
            <input
                type="file"
                id="input-file"
                ref="input"
                :accept="acceptString"
                @input="fileInput"
                data-test="input-file"
            />
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watchEffect, computed } from 'vue';
import VideoPlayerVue from '@/components/VideoPlayer.vue';
import ImageVue from './Image.vue';

import { useI18n } from 'vue-i18n';

export default defineComponent({
    components: {
        VideoPlayerVue,
        ImageVue,
    },
    props: {
        tabindex: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            defalut: true,
        },
        fileData: {
            type: Object as PropType<File | FileSystemFileHandle | ImageSingle>,
        },
        acceptImage: {
            type: Boolean,
            default: true,
        },
        acceptVideo: {
            type: Boolean,
            default: true,
        },
    },

    emits: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        paste: (data: File) => true,
    },

    setup(props, { emit }) {
        const imageField = ref<HTMLElement>();
        const imageData = ref<File>();
        const input = ref<HTMLInputElement>();
        const isVideo = ref(false);
        const { t } = useI18n();

        const acceptString = computed(() => {
            const str = [];
            if (props.acceptImage) str.push('image/*');
            if (props.acceptVideo) str.push('video/*');
            return str.join(',');
        });

        watchEffect(async () => {
            const data = props.fileData;

            //ImageSingle
            if (data != undefined && 'getImage' in data) {
                const handle = await data.getImage();
                const file = await handle.getFile();
                imageData.value = file;

                if (/video\/\S*/g.test(data.manifest.type)) {
                    isVideo.value = true;
                    return;
                }
                isVideo.value = false;
                return;
            }

            //FileSystemFileHandle
            if (data != undefined && 'getFile' in data) {
                const file = await data.getFile();
                imageData.value = file;

                if (/video\/\S*/g.test(file.type)) {
                    isVideo.value = true;
                    return;
                }
                isVideo.value = false;
                return;
            }

            //File
            if (data != undefined) {
                imageData.value = data;
                if (/video\/\S*/g.test(data.type)) {
                    isVideo.value = true;
                    return;
                }
                isVideo.value = false;
                return;
            }

            //undefined
            isVideo.value = false;
            imageData.value = data;
            return;
        });

        function fileInput() {
            if (!input.value) return;
            if (input.value.files?.length == 1) {
                const file = input.value.files[0];

                //Сброс выбранного файла в input элементе,
                //чтобы этот же файл можно было выбрать ещё раз
                input.value.value = '';

                emit('paste', file);
            }
        }

        return {
            imageField,
            imageData,
            input,
            fileInput,
            isVideo,
            acceptString,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.input-image {
    line-height: 0;
    @include z-depth();
    @include focus();

    .media-wrapper {
        display: flex;
        justify-content: center;
    }

    .input-file {
        line-height: normal;
        font-size: 2rem;
        color: $color-text-second;
        padding: 5px 7px 5px 7px;
        @include flex-center();
        @include material(1);

        p {
            margin: 0px;
        }

        .icon {
            position: relative;
            height: 2rem;
            width: 2rem;
            margin-right: 10px;

            &::before {
                @include pseudo();
                top: -50%;
                height: inherit;
                width: inherit;
                background-color: $color-text-main;
                clip-path: polygon(
                    15% 70%,
                    50% 50%,
                    85% 70%,
                    60% 70%,
                    60% 100%,
                    40% 100%,
                    40% 70%
                );
            }

            &::after {
                @include pseudo();
                bottom: 12%;
                height: inherit;
                width: inherit;
                background-color: $color-text-main;
                clip-path: polygon(
                    92% 71%,
                    78% 50%,
                    86% 50%,
                    100% 71%,
                    92% 100%,
                    8% 100%,
                    0 71%,
                    14% 50%,
                    22% 50%,
                    8% 71%,
                    24% 71%,
                    33% 87%,
                    67% 87%,
                    76% 71%
                );
            }
        }

        &:hover {
            @include material(3);
            cursor: pointer;
        }

        input {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
    }

    & img {
        display: block;
        max-height: 90vh;
        max-width: 40vw;
    }

    .video {
        max-height: 90vh;
        max-width: 40vw;
    }
}
</style>
