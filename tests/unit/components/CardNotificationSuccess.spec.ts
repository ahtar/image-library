import { mount } from "@vue/test-utils";

import CardNotificationSuccess from "@/components/CardNotificationSuccess.vue";

describe("CardNotificationSuccess.vue", () => {
  it("рендерит текст, полученный из  props.message", () => {
    const wrapper = mount(CardNotificationSuccess, {
      props: {
        message: "Hello World",
      },
    });

    expect(wrapper.html()).toContain("Hello World");
  });

  it("событие Close при нажатии", async () => {
    const wrapper = mount(CardNotificationSuccess, {
      props: {
        message: "Hello World",
      },
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted().close).toBeDefined();
  });
});
