import { mount, shallowMount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import ScrollBar from "@/components/ScrollBar.vue";

describe("ScrollBard.vue", () => {
  it("emit scroll при нажатии", async () => {
    const wrapper = mount(ScrollBar, {
      global: {
        plugins: [createTestingPinia({})],
      },
    });

    await userEvent.click(wrapper.element);

    expect(wrapper.emitted().scroll).toBeDefined();
  });
});
