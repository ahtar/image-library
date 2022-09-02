import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";

import ButtonSmall from "@/components/ButtonSmall.vue";

describe("ButtonSmall.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>Hello World</p>`,
            },
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it("Рендерит slot", () => {
        expect(wrapper.text()).toContain("Hello World");
    });

    it("кнопка активна при props.blocked == false", async () => {
        await wrapper.setProps({blocked: false});
        await userEvent.click(wrapper.element);
        expect(wrapper.emitted().click).toBeTruthy();
    });

    it("кнопка не активна при props.blocked == true", async () => {
        await wrapper.setProps({blocked: true});
        await userEvent.click(wrapper.element);
        expect(wrapper.emitted().click).not.toBeTruthy();
    });
});
