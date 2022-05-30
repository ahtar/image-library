import { shallowMount, mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';

import ButtonSmall from '@/components/ButtonSmall.vue'


describe('ButtonSmall.vue', () => {
    it('Рендерит slot', () => {
        const msg = 'Hello World';
        const wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>${msg}</p>`
            }
        });

        expect(wrapper.text()).toMatch(msg);
    });

    it('кнопка не активна когда props.blocked = false', async () => {
        const msg = 'Hello World';
        const wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>${msg}</p>`
            },
            props: {
                blocked: false
            }
        });

        expect(wrapper.find('.blocked').exists()).not.toBeTruthy();

        await userEvent.click(wrapper.element);

        expect(wrapper.emitted().click).toBeTruthy();
    });

    it('кнопка активна когда props.blocked = true', async () => {
        const msg = 'Hello World';
        const wrapper = mount(ButtonSmall, {
            slots: {
                default: `<p>${msg}</p>`
            },
            props: {
                blocked: true
            }
        });

        expect(wrapper.find('.blocked').exists()).toBeTruthy();

        await userEvent.click(wrapper.element);

        expect(wrapper.emitted().click).not.toBeTruthy();
    });
});