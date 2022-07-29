<template>
    <div class="set-wrapper">
        <button-small @click="cancel" class="button">{{t('BUTTON.CANCEL')}}</button-small>
        <button-small @click="save" class="button">{{t('BUTTON.CONFIRM')}}</button-small>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n'
import ButtonSmall from "@/components/ButtonSmall.vue";

export default defineComponent({
    components: {
        ButtonSmall,
    },
    emits: ["cancel", "save"],
    setup(props, { emit }) {
        
        const { t } = useI18n();
        return {
            save() {
                emit("save");
            },
            cancel() {
                emit("cancel");
            },
            t
        };
    },
});
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
