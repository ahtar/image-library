import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import InputTag from "@/components/InputTag.vue";

describe("InputTag.vue", () => {
  it("теги отображаются", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
      },
    });

    for (const tag of wrapper.props().tags) {
      expect(wrapper.html()).toContain(tag);
    }
  });

  it("новый тег добавляется", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
      },
      attachTo: document.body,
    });

    await wrapper.find("input").setValue("tag 4");
    wrapper.find("input").element.focus();

    await userEvent.keyboard("{Enter}");

    expect(wrapper.emitted().add).toBeDefined();
  });

  it("новый тег не добавляется, если он уже существует", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
      },
      attachTo: document.body,
    });

    await wrapper.find("input").setValue("tag 3");
    wrapper.find("input").element.focus();

    await userEvent.keyboard("{Enter}");

    expect(wrapper.emitted().add).not.toBeDefined();
  });

  it("существующие теги предлагаются", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
        definedTags: [
          {
            name: "tag 4",
            count: 10,
          },
        ],
      },
    });

    await wrapper.find("input").setValue("tag 4");

    expect(wrapper.html()).toContain("tag 4 (10)");
  });

  it("предложенный тег добавляется кликом", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
        definedTags: [
          {
            name: "tag 4",
            count: 10,
          },
        ],
      },
      attachTo: document.body,
    });

    wrapper.find("input").element.focus();
    await wrapper.find("input").setValue("tag 4");

    await userEvent.click(
      wrapper.findAll<HTMLElement>('[data-test="input-tag-suggestion"]')[0]
        .element
    );

    expect(wrapper.emitted().add).toBeDefined();
  });

  it("автозаполнение работает", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
        definedTags: [
          {
            name: "tag 4",
            count: 10,
          },
        ],
      },
      attachTo: document.body,
    });

    wrapper.find("input").element.focus();
    await wrapper.find("input").setValue("tag");

    await userEvent.keyboard("{ArrowDown}");

    expect(wrapper.find<HTMLInputElement>("input").element.value).toBe("tag 4");
  });

  it("тег удаляется", async () => {
    const wrapper = mount(InputTag, {
      global: {
        plugins: [createTestingPinia({})],
      },
      props: {
        tags: ["tag 1", "tag 2", "tag 3"],
      },
    });

    await userEvent.click(wrapper.find('[data-test="tag-container"]').element);

    expect(wrapper.emitted().remove).toBeDefined();
  });
});
