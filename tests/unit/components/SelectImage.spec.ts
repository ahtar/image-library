import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import SelectImage from "@/components/SelectImage.vue";
import ImageSingle from "@/classes/ImageSingle";

jest.mock("@/classes/ImageSet");
jest.mock("@/classes/ImageSingle");
jest.mock("@/composables/image-rendering");

describe("SelectImage.vue", () => {
  it("Полученный сет рендерится", async () => {
    const wrapper = mount(SelectImage, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        set: [
          new ImageSingle({} as any, {} as any),
          new ImageSingle({} as any, {} as any),
          new ImageSingle({} as any, {} as any),
        ],
      },
    });
    await wrapper.vm.$nextTick();

    //в документе должно быть 3 изображения, src не должен быть пустым
    expect(wrapper.findAll("img").length).toBe(3);
    for (const img of wrapper.findAll("img")) {
      expect(img.element.src).not.toBe("");
    }
  });

  it("emit change при смене изображения", async () => {
    const wrapper = mount(SelectImage, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        set: [
          new ImageSingle({} as any, {} as any),
          new ImageSingle({} as any, {} as any),
          new ImageSingle({} as any, {} as any),
        ],
      },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();

    //жмем на второе изображение в сете
    await userEvent.click(wrapper.findAll("img")[1].element);

    const event = wrapper.emitted().change;

    //событие change должно быть отправлено, в качестве параметра будет второе изображение в сете
    expect(event).toBeDefined();
    expect(event.flat()).toContain(wrapper.props().set[1]);

    wrapper.unmount();
  });

  it("при смене на то же самое изображение, событие change не отправляется", async () => {
    const wrapper = mount(SelectImage, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        set: [
          new ImageSingle({} as any, {} as any),
          new ImageSingle({} as any, {} as any),
          new ImageSingle({} as any, {} as any),
        ],
      },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();

    //жмем на первое изображение в сете, оно и является активным
    await userEvent.click(wrapper.findAll("img")[0].element);

    //событие change не должно быть отправлено
    expect(wrapper.emitted().change).not.toBeDefined();

    wrapper.unmount();
  });
});
