import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import InputText from "@/components/InputText.vue";

describe("InputText.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                label: "test label",
                placeholder: "test placeholder",
                active: true,
                important: true
            },
            attachTo: document.body,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[class="input-wrapper"]').exists()).toBe(true);
    });

    it("label отображается", () => {
        expect(wrapper.html()).toContain("test label");
    });

    it("стиль label зависит от props.important", () => {
        expect(wrapper.find('[data-test="input-text-label"]').classes()).toContain(
            "important"
        );
    });

    it("placeholder отображается", () => {
        expect(wrapper.find<HTMLInputElement>("input").element.placeholder).toBe(
            "test placeholder"
        );
    });

    it("компонент не активен, если props.active == false", async () => {
        await wrapper.setProps({ active: false });

        expect(
            wrapper.find('[data-test="input-test-disabled"]').element
        ).toBeDefined();
    });

    it("Input меняется на Textarea если props.textarea == true", async () => {
        await wrapper.setProps({ textarea: true });

        expect(wrapper.find("textarea")).toBeDefined();
        expect(wrapper.find<HTMLInputElement>("textarea").element.placeholder).toBe(
            "test placeholder"
        );
    });

    it("компонент поддерживает v-model", async () => {
        await wrapper.setProps({ modelValue: "test model text" });

        expect(wrapper.find<HTMLInputElement>("input").element.value).toBe(
            "test model text"
        );

        await wrapper
            .find<HTMLInputElement>("input")
            .setValue("new test model text");

        expect(wrapper.emitted()["update:modelValue"]).toBeDefined();
        expect(
            wrapper
                .emitted()
            ["update:modelValue"].flat()
                .includes("new test model text")
        ).toBeTruthy();
    });

    it("нажатие Enter вызывает событие enterKey", async () => {
        wrapper.find("input").element.focus();

        await userEvent.keyboard("{Enter}");

        expect(wrapper.emitted().enterKey).toBeDefined();
    });

    it("нажатие ArrowDown вызывает событие quickSuggestion", async () => {
        wrapper.find("input").element.focus();

        await userEvent.keyboard("{ArrowDown}");

        expect(wrapper.emitted().quickSuggestion).toBeDefined();
    });
});
