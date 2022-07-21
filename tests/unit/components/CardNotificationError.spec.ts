import { mount } from "@vue/test-utils";

import CardNotificationError from "@/components/CardNotificationError.vue";

describe("CardNotificationError.vue", () => {
  it("рендерит текст, полученный из  props.message", () => {
    const wrapper = mount(CardNotificationError, {
      props: {
        message: "Hello World",
      },
    });

    expect(wrapper.html()).toContain("Hello World");
  });

  it("событие Close при нажатии", async () => {
    const wrapper = mount(CardNotificationError, {
      props: {
        message: "Hello World",
      },
    });

    await wrapper.trigger("click");
    expect(wrapper.emitted().close).toBeDefined();
  });
});
