import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';

import ButtonSmall from '@/components/ButtonSmall.vue'


describe('ButtonSmall.vue', () => {
    it('Рендерит slot', () => {
        const wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>Hello World</p>`
            }
        });

        expect(wrapper.text()).toContain('Hello World');
    });

    it('кнопка активна при props.blocked == false', async () => {
        const wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>Hello World</p>`
            },
            props: {
                blocked: false
            }
        });

        await userEvent.click(wrapper.element);
        expect(wrapper.emitted().click).toBeTruthy();
    });

    it('кнопка не активна при props.blocked == true', async () => {
        const wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>Hello World</p>`
            },
            props: {
                blocked: true
            }
        });

        await userEvent.click(wrapper.element);
        expect(wrapper.emitted().click).not.toBeTruthy();
    });
});