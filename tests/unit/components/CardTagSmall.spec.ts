import { mount } from "@vue/test-utils";

import CardTagSmall from "@/components/CardTagSmall.vue";

describe("CardTagSmall.vue", () => {
  it("рендерит полученный props.tag", () => {
    const tag: Tag = {
      name: "test",
      count: 50,
    };
    const wrapper = mount(CardTagSmall, {
      props: {
        tag,
      },
    });

    expect(wrapper.html()).toContain("test (50)");
  });
});
