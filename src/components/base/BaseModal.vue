<template>
  <div class="base-modal" @click="close">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["close"],

  setup(props, { emit }) {
    return {
      close(event: MouseEvent) {
        const classList = (event.target as Element).classList.value.split(" ");
        if (classList.includes("base-modal") || classList.includes("wrapper")) {
          emit("close");
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.base-modal {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  @include flex-center;
  flex-wrap: nowrap;
}
</style>
