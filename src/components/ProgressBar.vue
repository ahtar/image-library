<template>
  <modal-dark>
    <div class="progress-bar-wrapper">
      <base-progress-bar
        class="progress-bar"
        :value="store.value"
        :max="store.max"
      />
      <p>({{ store.value }}/{{ store.max }})</p>
    </div>
  </modal-dark>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ModalDark from "@/components/ModalDark.vue";
import BaseProgressBar from "@/components/base/BaseProgressBar.vue";

import { useProgressBarStore } from "@/store/modals/modal-progress-bar";

export default defineComponent({
  components: {
    ModalDark,
    BaseProgressBar,
  },

  setup(props, { emit }) {
    const store = useProgressBarStore();
    return {
      store,
    };
  },
});
</script>
<style lang="scss" scoped>
.progress-bar-wrapper {
  background-color: $color-dark-1;
  border: thin solid $color-border-dark-1;
  border-radius: $radius-big;
  @include z-depth();
  display: flex;
  flex-direction: column;
  color: $color-text-main;
  font-size: 1.4rem;
  padding: 7px;

  .progress-bar {
    width: 30vw;
  }
}
</style>
