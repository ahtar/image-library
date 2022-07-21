<template>
  <div class="scroll-component" @click="click"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["scroll"],
  setup(props, { emit }) {
    return {
      click() {
        emit("scroll");
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.scroll-component {
  position: absolute;
  right: 10px;
  height: 100vh;
  width: 5vw;
  transition: opacity 0.5s ease;
  opacity: 0;
  background-image: linear-gradient(#00000004, #000000a6 80%);
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}
</style>
