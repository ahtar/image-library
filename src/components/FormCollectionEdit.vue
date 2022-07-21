<template>
  <modal-dark @close="store.close" data-test="modal">
    <div class="content-wrapper" data-test="collection-edit-wrapper">
      <input-text
        class="wrapper-section"
        label="Name"
        placeholder="Collection name"
        :important="true"
        v-model="data.name"
        data-test="collection-edit-name"
      />
      <input-text
        class="wrapper-section"
        label="Theme"
        placeholder="Collection theme"
        v-model="data.theme"
        data-test="collection-edit-theme"
      />
      <input-text
        class="wrapper-section input-description"
        label="Description"
        placeholder="Collection description"
        v-model="data.description"
        :textarea="true"
        data-test="collection-edit-description"
      />
      <div class="wrapper-section section-checkbox">
        <input-checkbox
          v-model="store.form.options.corrupted"
          label="Corrupted"
          data-test="collection-edit-corrupted"
        />
      </div>
      <div class="wrapper-section button-container">
        <button-small
          @click="store.save"
          :blocked="!buttonSaveActive"
          data-test="collection-edit-save"
          >Save</button-small
        >
        <button-small @click="fix">Fix</button-small>
      </div>
    </div>

    <div class="image-wrapper wrapper">
      <input-image
        :active="true"
        :blob="data.blob!"
        @paste="imagePasteEvent"
        data-test="collection-edit-image"
      />
    </div>
  </modal-dark>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import ModalDark from "@/components/ModalDark.vue";
import InputText from "@/components/InputText.vue";
import InputImage from "@/components/InputImage.vue";
import InputCheckbox from "@/components/InputCheckbox.vue";
import ButtonSmall from "@/components/ButtonSmall.vue";

import { useCollectionEditStore } from "@/store/forms/form-collection-edit";

export default defineComponent({
  components: {
    ModalDark,
    InputText,
    InputImage,
    InputCheckbox,
    ButtonSmall,
  },
  setup() {
    const store = useCollectionEditStore();

    const buttonSaveActive = computed(() => {
      return store.form.name != "";
    });

    async function imagePasteEvent(data: Blob) {
      store.form.blob = data;
    }

    async function fix() {
      if (!store.collection?.loaded)
        await store.collection?.initLoadCollection();
      const sets = store.collection?.arr.filter((image) => {
        if ("arr" in image) return image;
      });
      const doublesArr: ImageSingle[] = [];

      for (const imageSet of sets!) {
        for (const image of (imageSet as ImageSet).arr) {
          const double = store.collection!.arr.find(
            (i) => i.manifest.id == image.manifest.id
          );
          if (double) {
            doublesArr.push(double as any as ImageSingle);
            console.log("found double!");
          }
        }
      }

      console.info("number of doubles:", doublesArr.length);

      for (const image of doublesArr) {
        //console.info('image double:', image);
        image.manifest.fileUrl = "";
        image.manifest.previewFileUrl = "";
      }

      console.log(doublesArr);
    }

    return {
      store,
      data: store.form,
      imagePasteEvent,
      buttonSaveActive,
      fix,
    };
  },
});
</script>

<style lang="scss" scoped>
.content-wrapper {
  width: 30vw;
  height: fit-content;
  min-width: fit-content;
  margin-left: 10vw;
  background-color: $color-dark-1;
  border: thin solid $color-border-dark-1;
  border-radius: $radius-big;
  @include z-depth();
  display: flex;
  flex-direction: column;

  .input-description {
    height: 20vh;
  }

  .wrapper-section {
    margin: max(7px, 2%);
  }

  .section-checkbox {
    display: flex;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    width: 96%;
    justify-content: space-around;
  }
}

.image-wrapper {
  margin-right: 3vw;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-small {
  margin: 2%;
}
</style>
