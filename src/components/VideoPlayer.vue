<template>
    <video class="video-player" controls autoplay loop ref="video" muted>
        <source ref="source" />
    </video>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue';
import crypto from '@/modules/crypto';

export default defineComponent({
    props: {
        data: {
            type: Object as PropType<
                Blob | File | FileSystemFileHandle | ImageSingle | null
            >,
        },
    },

    setup(props) {
        const source = ref<HTMLSourceElement>();
        const video = ref<HTMLVideoElement>();

        watchEffect(async () => {
            if (!props.data) return;
            if (!source.value) return;
            if (!video.value) return;

            //ImageSingle
            if ('getImage' in props.data) {
                const handle = await props.data.getImage();
                const file = await handle.getFile();

                if (!props.data) return;
                if (!source.value) return;

                if (file.name.includes('dpx')) {
                    const arrayBuffer = await file.arrayBuffer();
                    source.value.src = URL.createObjectURL(
                        await crypto.recover(arrayBuffer)
                    );
                } else {
                    source.value.src = URL.createObjectURL(file);
                }
                source.value.type = file.type;
                video.value.load();
                video.value.play();
                return;
            }

            //FileSystemFileHandle
            if ('getFile' in props.data) {
                const file = await props.data.getFile();

                if (!props.data) return;
                if (!source.value) return;

                if (file.name.includes('dpx')) {
                    const arrayBuffer = await file.arrayBuffer();
                    source.value.src = URL.createObjectURL(
                        await crypto.recover(arrayBuffer)
                    );
                } else {
                    source.value.src = URL.createObjectURL(file);
                }

                video.value.pause();
                source.value.src = URL.createObjectURL(file);
                source.value.type = file.type;
                video.value.load();
                video.value.play();
                return;
            }

            //File или Blob
            if (!props.data) return;
            if (!source.value) return;

            video.value.pause();
            source.value.src = URL.createObjectURL(props.data);
            source.value.type = props.data.type;
            video.value.load();
            video.value.play();
        });

        return {
            source,
            video,
        };
    },
});
</script>

<style lang="scss" scoped>
.video-player {
    max-height: 100%;
    max-width: 100%;
}
</style>
