<template>
    <div class="set-wrapper">
        <button-small @click="cancel" class="button">Отмена</button-small>
        <button-small @click="save" class="button">Сохранить</button-small>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ButtonSmall from '@/components/ButtonSmall.vue'

export default defineComponent({
    components: {
        ButtonSmall,
    },
    emits: ['cancel', 'save'],
    setup(props, {emit}) {
        return {
            save() {
                emit('save');
            },
            cancel() {
                emit('cancel');
            }
        }
    },
})
</script>


<style lang="scss" scoped>
    .set-wrapper {
        @include flex-center;
        position: fixed;
        bottom: 3vh;
        right: 3vw;
    }
    .button {
        margin-right: 10px;
    }
</style>