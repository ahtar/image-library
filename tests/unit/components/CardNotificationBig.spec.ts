import { mount } from "@vue/test-utils";

import CardNotificationBig from "@/components/CardNotificationBig.vue";

describe("CardNotificationBig.vue", () => {
  it("рендерит текст, полученный из  props.message", () => {
    const wrapper = mount(CardNotificationBig, {
      props: {
        message: "Hello World",
      },
    });

    expect(wrapper.html()).toContain("Hello World");
  });

  it("негативное оповещение при props.status == false", () => {
    const wrapper = mount(CardNotificationBig, {
      props: {
        message: "Hello World",
        status: false,
      },
    });

    expect(wrapper.find(".success").exists()).toBe(false);
    expect(wrapper.find(".error").exists()).toBe(true);
  });

  it("положительное оповещение при props.status == false", () => {
    const wrapper = mount(CardNotificationBig, {
      props: {
        message: "Hello World",
        status: true,
      },
    });

    expect(wrapper.find(".success").exists()).toBe(true);
    expect(wrapper.find(".error").exists()).toBe(false);
  });
});
