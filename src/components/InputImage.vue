<template>
    <div class="input-image" ref="imageField" :tabindex="tabindex" @paste="pasteEvent"
        @contextmenu.prevent="contextMenuOpen(null, $event)">
        <img ref="image" />
        <div class="message" v-if="imageActive == false">{{t('INPUT_IMAGE.MESSAGE')}}</div>

        <transition-fade>
            <menu-context class="menu-context" v-if="contextMenuActive" :event="contextMenuEvent!"
                @close="contextMenuClose" data-test="input-image-context">
                <div @click="pasteEvent" data-test="input-image-context-paste">{{t('BUTTON.INPUT')}}</div>
            </menu-context>
        </transition-fade>
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

import MenuContext from "@/components/MenuContext.vue";
import TransitionFade from "@/components/TransitionFade.vue";

import useClipboard from "@/composables/clipboard";
import useImageRendering from "@/composables/image-rendering";
import useContextMenu from "@/composables/context-menu";

import { useI18n } from "vue-i18n";

export default defineComponent({
    components: {
        MenuContext,
        TransitionFade,
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
        blob: {
            type: Object as PropType<Blob | FileSystemFileHandle>,
        },
    },

    emits: ["paste"],

    setup(props, { emit }) {
        const imageField = ref<HTMLElement | null>(null);
        const image = ref<HTMLImageElement | null>(null);
        const imageActive = ref(false);
        const { t } = useI18n();

        const { readFromClipboard } = useClipboard();
        const { renderImage } = useImageRendering();
        const {
            contextMenuActive,
            contextMenuEvent,
            contextMenuOpen,
            contextMenuClose,
        } = useContextMenu();

        let blobObjectUrl: string;

        //Чтение первого изображения из буфера обмена
        async function pasteEvent() {
            contextMenuClose();
            if (props.active) {
                const item: any = await readFromClipboard();
                const type = item[0].types.find((t: any) => t.includes("image"));
                if (type) {
                    const b = await item[0].getType(type);
                    emit("paste", b);
                }
            }
        }

        //Реагирование на изменение blob
        //Перерисовка изображения.
        watch(
            () => props.blob,
            (newData) => {
                URL.revokeObjectURL(blobObjectUrl);
                renderImage(image.value!, props.blob);
                if (props.blob != undefined) {
                    imageActive.value = true;
                } else {
                    imageActive.value = false;
                }
            }
        );

        //Инициализация.
        onMounted(() => {
            if (props.blob) {
                renderImage(image.value!, props.blob);
                imageActive.value = true;
            }
        });

        onBeforeUnmount(() => {
            URL.revokeObjectURL(image.value!.src);
        });

        return {
            imageField,
            image,
            imageActive,
            pasteEvent,

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
