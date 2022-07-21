<template>
  <div class="input-checkbox-wrapper">
    <div
      class="input-checkbox-label"
      v-if="label != ''"
      data-test="input-checkbox-label"
    >
      {{ label }}
    </div>
    <input
      class="input-checkbox"
      type="checkbox"
      @change="input"
      ref="checkbox"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      required: true,
      type: Boolean,
    },
    displayBox: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const checkbox = ref<HTMLInputElement>();

    function input(value: Event) {
      emit("update:modelValue", (value.target as HTMLInputElement).checked);
    }

    //Для случая, когда modelValue изменился каким-либо другим способом.
    watch(
      () => props.modelValue,
      () => {
        checkbox.value!.checked = props.modelValue;
      }
    );

    onMounted(() => {
      if (checkbox.value) checkbox.value.checked = props.modelValue;
    });

    return {
      input,
      checkbox,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-checkbox-wrapper {
  display: flex;
  position: relative;
  padding: 2px 5px 2px 5px;
  flex-direction: row;
  align-items: center;
  background-color: $color-dark-2;
  border: thin solid $color-border-dark-2;
  border-radius: $radius-big;
  color: $color-text-second;
  @include z-depth(2);

  .input-checkbox {
    margin: 0;
    margin-left: 5px;
    -webkit-appearance: none;
    appearance: none;
    background-color: $color-text-main;
    border: 0.1rem solid $color-border-dark-5;
    width: 1rem;
    height: 1rem;
    display: grid;
    place-content: center;
    @include focus();

    &::before {
      content: "";
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      width: 0.7rem;
      height: 0.7rem;
      transform: scale(0);
      transition: 60ms transform ease-in-out;
      background-color: $color-dark-4;
    }

    &:checked::before {
      transform: scale(1);
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
