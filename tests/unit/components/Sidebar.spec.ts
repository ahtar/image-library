import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import Sidebar from "@/components/Sidebar.vue";

describe("Sidebar.vue", () => {
  it("slot рендерится", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: "<div>Test slot content</div>",
      },
    });

    expect(wrapper.html()).toContain("Test slot content");
  });

  it("изначально задвинут", () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: "<div>Test slot content</div>",
      },
    });

    expect((wrapper.element as HTMLElement).style.transform).not.toBe(
      "translate(0, 0)"
    );

    wrapper.unmount();
  });

  it("выдвигается при наведении мыши", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: "<div>Test slot content</div>",
      },
    });

    await wrapper.trigger("mouseenter");
    expect((wrapper.element as HTMLElement).style.transform).toBe(
      "translate(0, 0)"
    );

    wrapper.unmount();
  });

  it("задвигается при отведении мыши", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: "<div>Test slot content</div>",
      },
    });

    await wrapper.trigger("mouseenter");
    await wrapper.trigger("mouseleave");
    expect((wrapper.element as HTMLElement).style.transform).not.toBe(
      "translate(0, 0)"
    );
    wrapper.unmount();
  });

  it("отправляет событие unfocus при отведении мыши", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: "<div>Test slot content</div>",
      },
    });

    await wrapper.trigger("mouseenter");
    await wrapper.trigger("mouseleave");
    expect(wrapper.emitted().unfocus).toBeDefined();
    wrapper.unmount();
  });

  it("slot элементы могут быть сфокусированы в выдвинутом состоянии", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: '<button class="focusable">Test slot content</button>',
      },
      attachTo: document.body,
    });

    expect(document.activeElement).toBe(document.body);

    await wrapper.trigger("mouseenter");
    await userEvent.tab();

    expect(document.activeElement).toBe(wrapper.find("button").element);

    wrapper.unmount();
  });

  it("slot элементы не могут быть сфокусированы в задвинутом состоянии", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: '<button class="focusable">Test slot content</button>',
      },
      attachTo: document.body,
    });

    expect(document.activeElement).toBe(document.body);

    await userEvent.tab();

    expect(document.activeElement).toBe(document.body);

    wrapper.unmount();
  });

  it("slot элементы расфокусируются при задвигании", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({})],
      },
      slots: {
        default: '<button class="focusable">Test slot content</button>',
      },
      attachTo: document.body,
    });

    await wrapper.trigger("mouseenter");
    await userEvent.tab();
    expect(document.activeElement).toBe(wrapper.find("button").element);

    await wrapper.trigger("mouseleave");
    expect(document.activeElement).toBe(document.body);

    wrapper.unmount();
  });
});
