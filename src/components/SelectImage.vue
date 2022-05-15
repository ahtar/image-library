<template>
    <div class="select-images" @drop="drop($event)" @dragenter.prevent @dragover.prevent v-if="draggable">
        <card-image-small v-for="(card, i) in set" draggable="true"
        @dragstart="drag($event, card)"
        @dragover="dragOver($event, card)"
        :key="card.id" 
        :image="card"
        @click="change(card, $event)" 
        :id="i"/>
    </div>
    <div class="select-images" v-else>
        <card-image-small v-for="(card, i) in set"
        :key="card.id" 
        :image="card"
        @click="change(card, $event)" 
        :id="i"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

import CardImageSmall from '@/components/CardImageSmall.vue'

export default defineComponent({
    components: {
        CardImageSmall
    },
    props: {
        set: {
            type: Array,
            required: true
        },
        draggable: {
            default: false
        }
    },
    emits: ['change', 'dragSort'],
    setup(props, { emit }) {
        let selectedImage: any = null;
        let dragOverId = '';
        onMounted(async () => {
            selectedImage = document.getElementById(`${0}`)?.children[0];
            selectedImage.classList.toggle('selected');
        });

        function drag(event: DragEvent, card: ImageSingle) {
            event.dataTransfer!.effectAllowed = 'move';
            event.dataTransfer!.dropEffect = 'move';
            event.dataTransfer!.setData('id', card.manifest.id);
            change(card, event);
        }

        function dragOver(event: DragEvent, card: ImageSingle) {
            if(card.manifest.id != dragOverId) {
                dragOverId = card.manifest.id;
            }
        }

        function drop(event: DragEvent) {
            const id = event.dataTransfer!.getData('id');
            const fromIndex = (props.set as ImageSingle[]).findIndex((image) => image.manifest.id == id);
            const toIndex = (props.set as ImageSingle[]).findIndex((image) => image.manifest.id == dragOverId);

            const item = (props.set as ImageSingle[]).find((image) => image.manifest.id == id);
            if(item) change(item, event);

            emit('dragSort', {
                fromIndex,
                toIndex
            });
        }

        function change(card: ImageSingle, event: any) {
            if(event.target != selectedImage) {
                selectedImage.classList.toggle('selected');
                event.target.classList.toggle('selected');
                selectedImage = event.target;
                emit('change', card);
            }
        }

        return {
            change,
            drag,
            dragOver,
            drop
        }
    },
})
</script>

<style lang="scss" scoped>
    .select-images {
        @include flex;
        @include scroll;
        max-height: 80vh;
        overflow-y: auto;
        overflow-x: hidden;
        flex-wrap: nowrap;
        flex-direction: column;
        background-color: $color-dark-2;
        border-right: thin solid $color-border-dark-2;

        .base-card {
            margin: 5px
        }
    }
</style>