<template>
    <div class="input-image" ref="imageField" :tabindex="tabindex" @paste="pasteEvent">
        <img ref="image">
        <div class="message" v-if="imageActive == false">Вставь картинку</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'

import useClipboard from '@/composables/clipboard'

export default defineComponent({
    props: {
        tabindex: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            defalut: true
        },
        blob: {
            type: Blob
        }
    },

    emits: ['paste'],

    setup(props, { emit }) {

        const imageField = ref<HTMLElement | null>(null);
        const image = ref<HTMLImageElement | null>(null);
        const imageActive = ref(false);

        const { readFromClipboard } = useClipboard();

        let blobObjectUrl: string;

        //Чтение первого изображения из буфера обмена
        async function pasteEvent() {
            if(props.active) {
                const item: any = await readFromClipboard();
                const type = item[0].types.find((t: any) => t.includes('image'));
                if(type) {
                    const b = await item[0].getType(type);
                    emit('paste', b);
                }
            }
            //emit('paste');
        };

        //Реагирование на изменение blob
        //Перерисовка изображения.
            watch(() => props.blob, (newData) => {
            URL.revokeObjectURL(blobObjectUrl);
            if(props.blob != undefined) {
                blobObjectUrl = URL.createObjectURL(props.blob);
                image.value!.src = blobObjectUrl;
                imageActive.value = true;
            } else {
                image.value!.src = '';
                imageActive.value = false;
            }
        });

        //Инициализация.
        onMounted(() => {
            if(props.blob) {
                URL.revokeObjectURL(blobObjectUrl);
                blobObjectUrl = URL.createObjectURL(props.blob);
                image.value!.src = blobObjectUrl;
                imageActive.value = true;
            }
        });

        onUnmounted(() => {
            URL.revokeObjectURL(blobObjectUrl);
        });
        return {
            imageField,
            image,
            imageActive,
            pasteEvent
        }
    },
})
</script>


<style lang="scss" scoped>
    .input-image {
        @include z-depth();
        @include focus();
        .message {
            min-width: 150px;
            min-height: 150px;
            padding: 20px;
            background-color: $color-dark-1;
            border: thin solid $color-border-dark-1;
            border-radius: $radius-big;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $color-text-second;
            font-size: 1.5rem;

            &:hover {
                cursor: default;
            }
        }

        & img {
            max-height: 90vh;
            max-width: 40vw;
        }
    }
</style>