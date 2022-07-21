import { mount, shallowMount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import TransitionFade from "@/components/TransitionFade.vue";

describe("TransitionFade.vue", () => {
  it("slot рендерится", () => {
    const wrapper = mount(TransitionFade, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: "<div>Test slot content</div>",
      },
    });

    expect(wrapper.html()).toContain("Test slot content");
  });
});
