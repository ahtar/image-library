<template>
    <div
        class="select-images"
        @drop="drop($event)"
        @dragenter.prevent
        @dragover.prevent
        v-if="draggable"
    >
        <card-image-small
            v-for="(card, i) in set"
            draggable="true"
            data-test="select-image-card"
            @dragstart="drag($event, card)"
            @dragover="dragOver($event, card)"
            :key="card.manifest.id"
            :image="card"
            @click="change(card, i, $event)"
            :id="i"
        />
    </div>
    <div class="select-images" v-else>
        <card-image-small
            v-for="(card, i) in set"
            data-test="select-image-card"
            :key="card.manifest.id"
            :image="card"
            @click="change(card, i, $event)"
            :id="i"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';

import CardImageSmall from '@/components/CardImageSmall.vue';

export default defineComponent({
    components: {
        CardImageSmall,
    },
    props: {
        set: {
            type: Array as PropType<ImageSingle[]>,
            required: true,
        },
        draggable: {
            default: false,
        },
    },

    emits: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        dragSort: (data: { fromIndex: number; toIndex: number }) => true,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        change: (image: ImageSingle, index: number) => true,
    },

    setup(props, { emit }) {
        let selectedImage: HTMLElement | null = null;
        let dragOverId = '';

        //Инициализация.
        onMounted(async () => {
            selectedImage = document.getElementById(`${0}`)
                ?.children[0] as HTMLElement;
            if (selectedImage != undefined) {
                selectedImage.classList.toggle('selected');
            }
        });

        //Начало Drag.
        function drag(event: DragEvent, card: ImageSingle) {
            if (!event.dataTransfer) return;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.setData('id', card.manifest.id);
        }

        function dragOver(event: DragEvent, card: ImageSingle) {
            if (card.manifest.id != dragOverId) {
                dragOverId = card.manifest.id;
            }
        }

        //Конец Drop.
        function drop(event: DragEvent) {
            if (!event.dataTransfer) return;
            const id = event.dataTransfer.getData('id');

            const fromIndex = (props.set as ImageSingle[]).findIndex(
                (image) => image.manifest.id == id
            );
            const toIndex = (props.set as ImageSingle[]).findIndex(
                (image) => image.manifest.id == dragOverId
            );

            emit('dragSort', {
                fromIndex,
                toIndex,
            });
        }

        //Изменение активного изображения.
        function change(card: ImageSingle, index: number, event: MouseEvent) {
            if (!event.target) return;
            const target = event.target as HTMLElement;
            if (selectedImage && event.target != selectedImage) {
                emit('change', card, index);
                selectedImage.classList.toggle('selected');
                target.classList.toggle('selected');
                selectedImage = target;
            }
        }

        return {
            change,
            drag,
            dragOver,
            drop,
        };
    },
});
</script>

<style lang="scss" scoped>
.select-images {
    flex-wrap: wrap;
    max-height: 80vh;
    min-width: fit-content;
    overflow-y: auto;
    overflow-x: hidden;
    flex-wrap: nowrap;
    @include scroll();
    @include flex-column();
    @include material(2);

    .base-card {
        margin: 5px;
    }
}
</style>
