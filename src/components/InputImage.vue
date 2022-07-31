<template>
    <div class="input-image" ref="imageField" :tabindex="tabindex">
        <img ref="image" />

        <label for="input-file" class="input-file">
            <div class="icon" />
            <p>Choose a file...</p>
            <input type="file" id="input-file" ref="input" accept="image/*,video/*" @input="fileInput($event)"
                data-test="input-file" />
        </label>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    PropType,
} from "vue";
import useImageRendering from "@/composables/image-rendering";
import useContextMenu from "@/composables/context-menu";

import { useI18n } from "vue-i18n";

export default defineComponent({
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
            type: Object as PropType<File | FileSystemFileHandle>,
        },
    },

    emits: {
        paste: (data: File) => true
    },

    setup(props, { emit }) {
        const imageField = ref<HTMLElement>();
        const image = ref<HTMLImageElement>();
        const input = ref<HTMLInputElement>();
        const imageActive = ref(false);
        const { t } = useI18n();

        const { renderImage } = useImageRendering();
        const {
            contextMenuActive,
            contextMenuEvent,
            contextMenuOpen,
            contextMenuClose,
        } = useContextMenu();

        //Реагирование на изменение blob
        //Перерисовка изображения.
        watch(
            () => props.fileData,
            (newData) => {
                renderImage(image.value!, props.fileData);
                if (props.fileData != undefined) {
                    imageActive.value = true;
                } else {
                    imageActive.value = false;
                }
            }
        );

        //Инициализация.
        onMounted(() => {
            if (props.fileData) {
                renderImage(image.value!, props.fileData);
                imageActive.value = true;
            }
        });

        onBeforeUnmount(() => {
            URL.revokeObjectURL(image.value!.src);
        });


        function fileInput(e: Event) {
            if (input.value!.files?.length == 1) {
                const file = input.value!.files[0];
                emit("paste", file);
            }
        }

        return {
            imageField,
            image,
            input,
            imageActive,
            fileInput,

            contextMenuActive,
            contextMenuOpen,
            contextMenuClose,
            contextMenuEvent,
            t
        };
    },
});
</script>

<style lang="scss" scoped>
.input-image {
    line-height: 0;
    @include z-depth();
    @include focus();

    .input-file {
        line-height: normal;
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $color-dark-1;
        border: thin solid $color-border-dark-1;
        color: $color-text-second;
        padding: 5px 7px 5px 7px;

        p {
            margin: 0px;
        }

        .icon {
            position: relative;
            height: 2rem;
            width: 2rem;
            margin-right: 10px;

            &::before {
                position: absolute;
                top: -50%;
                content: '';
                display: block;
                height: inherit;
                width: inherit;
                background-color: $color-text-main;
                clip-path: polygon(15% 70%, 50% 50%, 85% 70%, 60% 70%, 60% 100%, 40% 100%, 40% 70%);
            }

            &::after {
                position: absolute;
                bottom: 12%;
                content: '';
                display: block;
                height: inherit;
                width: inherit;
                background-color: $color-text-main;
                clip-path: polygon(92% 71%, 78% 50%, 86% 50%, 100% 71%, 92% 100%, 8% 100%, 0 71%, 14% 50%, 22% 50%, 8% 71%, 24% 71%, 33% 87%, 67% 87%, 76% 71%);
            }
        }

        &:hover {
            background-color: $color-dark-3;
            border: thin solid $color-border-dark-3;
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

    .menu-context {
        line-height: normal;
    }

    & img {
        display: block;
        max-height: 90vh;
        max-width: 40vw;
    }
}
</style>
