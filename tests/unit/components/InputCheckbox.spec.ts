import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";

import InputCheckbox from "@/components/InputCheckbox.vue";

describe("InputChecbox.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(InputCheckbox, {
            props: {
                label: "test label",
                modelValue: false,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[class="input-checkbox-wrapper"]').exists()).toBe(true);
    });

    it("label отображается", () => {
        expect(wrapper.text()).toBe("test label");
    });

    it("label не отображается, если props.label не указан", async () => {
        await wrapper.setProps({label: undefined});
        
        expect(
            wrapper.find<HTMLElement>('[data-test="input-checkbox-label"]').exists()
        ).toBe(false);
    });

    it("checkbox изначально включен, если modelValue = true", async () => {
        await wrapper.setProps({modelValue: true});

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
    });

    it("checkbox изначально выключен, если modelValue = false", () => {
        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(false);
    });

    it("checkbox реагирует на изменение modelValue", async () => {
        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(false);

        await wrapper.setProps({ modelValue: true });

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
    });

    it("checkbox коректно поддерживает v-model", async () => {
        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(false);

        await userEvent.click(wrapper.find<HTMLInputElement>("input").element);
        await wrapper.find<HTMLInputElement>("input").trigger("change");

        expect(wrapper.find<HTMLInputElement>("input").element.checked).toBe(true);
        expect(wrapper.emitted("update:modelValue")).not.toBe(undefined);
    });
});
