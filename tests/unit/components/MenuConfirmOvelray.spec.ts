import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import MenuConfrimOverlay from "@/components/MenuConfirmOverlay.vue";

describe("MenuConfirmOverlay.vue", () => {
  it("компонент рендерится", () => {
    const wrapper = mount(MenuConfrimOverlay, {
      global: {
        plugins: [createTestingPinia({})],
      },
    });

    expect(wrapper.html()).toContain("Сохранить");
    expect(wrapper.html()).toContain("Отмена");
  });

  it("событие save отправляется при подтверждении", async () => {
    const wrapper = mount(MenuConfrimOverlay, {
      global: {
        plugins: [createTestingPinia({})],
      },
    });

    await userEvent.click(wrapper.element.children[1]);

    expect(wrapper.emitted().save).toBeDefined();
  });

  it("событие cancel отправляется при отрицании", async () => {
    const wrapper = mount(MenuConfrimOverlay, {
      global: {
        plugins: [createTestingPinia({})],
      },
    });

    await userEvent.click(wrapper.element.children[0]);

    expect(wrapper.emitted().cancel).toBeDefined();
  });
});
