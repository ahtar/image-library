<template>
  <base-card class="collection-card-big">
    <img ref="imgRef" />
  </base-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, PropType, ref } from "vue";

import BaseCard from "@/components/base/BaseCard.vue";

import useImageRendering from "@/composables/image-rendering";

export default defineComponent({
  props: {
    fileHandle: {
      required: true,
      type: Object as PropType<FileSystemFileHandle | string>,
    },
  },
  components: {
    BaseCard,
  },
  setup(props) {
    const { renderImage } = useImageRendering();

    const imgRef = ref<null | HTMLImageElement>(null);

    onMounted(() => {
      renderImage(imgRef.value!, props.fileHandle);
    });

    onUpdated(() => {
      renderImage(imgRef.value!, props.fileHandle);
    });

    return {
      imgRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.collection-card-big {
  position: relative;
  margin: 10px;
  img {
    max-width: 30vw;
  }
}
</style>
