import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";

import InputCheckbox from "@/components/InputCheckbox.vue";

describe("InputChecbox.vue", () => {
    it("label отображается", () => {
        const wrapper = mount(InputCheckbox, {
            props: {
                label: "test label",
                modelValue: false,
            },
        });

        expect(wrapper.text()).toBe("test label");
    });

    it("label не отображается, если props.label не указан", () => {
        const wrapper = mount(InputCheckbox, {
            props: {
                modelValue: false,
            },
        });

        expect(
            wrapper.find<HTMLElement>('[data-test="input-checkbox-label"]').exists()
        ).toBe(false);
    });

    it("checkbox изначально включен, если modelValue = true", () => {
        const wrapper = mount(InputCheckbox, {
            props: {
                modelValue: true,
            },
        });

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
    });

    it("checkbox изначально выключен, если modelValue = false", () => {
        const wrapper = mount(InputCheckbox, {
            props: {
                modelValue: false,
            },
        });

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(false);
    });

    it("checkbox реагирует на изменение modelValue", async () => {
        const wrapper = mount(InputCheckbox, {
            props: {
                modelValue: false,
            },
        });

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(false);

        await wrapper.setProps({ modelValue: true });

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
    });

    it("checkbox коректно поддерживает v-model", async () => {
        const wrapper = mount(InputCheckbox, {
            props: {
                modelValue: false,
            },
        });

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(false);

        await userEvent.click(wrapper.find<HTMLInputElement>("input").element);
        await wrapper.find<HTMLInputElement>("input").trigger("change");

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
        expect(wrapper.emitted("update:modelValue")).not.toBe(undefined);
    });
});
