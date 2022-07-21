import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import InputText from "@/components/InputText.vue";

describe("InputText.vue", () => {
    it("label отображается", () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                label: "test label",
            },
        });

        expect(wrapper.html()).toContain("test label");
    });

    it("стиль label зависит от props.important", () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                label: "test label",
                important: true,
            },
        });

        expect(wrapper.find('[data-test="input-text-label"]').classes()).toContain(
            "important"
        );
    });

    it("placeholder отображается", () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                placeholder: "test placeholder",
            },
        });

        expect(wrapper.find<HTMLInputElement>("input").element.placeholder).toBe(
            "test placeholder"
        );
    });

    it("компонент не активен, если props.active == false", async () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                label: "test label",
                placeholder: "test placeholder",
                active: false,
            },
        });

        expect(
            wrapper.find('[data-test="input-test-disabled"]').element
        ).toBeDefined();
    });

    it("Input меняется на Textarea если props.textarea == true", () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                placeholder: "test placeholder",
                textarea: true,
            },
        });

        expect(wrapper.find("textarea")).toBeDefined();
        expect(wrapper.find<HTMLInputElement>("textarea").element.placeholder).toBe(
            "test placeholder"
        );
    });

    it("компонент поддерживает v-model", async () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                modelValue: "test model text",
            },
        });

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
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            attachTo: document.body,
        });

        wrapper.find("input").element.focus();

        await userEvent.keyboard("{Enter}");

        expect(wrapper.emitted().enterKey).toBeDefined();
    });

    it("нажатие ArrowDown вызывает событие quickSuggestion", async () => {
        const wrapper = mount(InputText, {
            global: {
                plugins: [createTestingPinia({})],
            },
            attachTo: document.body,
        });

        wrapper.find("input").element.focus();

        await userEvent.keyboard("{ArrowDown}");

        expect(wrapper.emitted().quickSuggestion).toBeDefined();
    });
});
