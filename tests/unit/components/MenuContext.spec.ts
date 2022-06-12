import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import MenuContext from '@/components/MenuContext.vue'

describe('MenuContext.vue', () => {
    it('slot рендерится', () => {
        const wrapper = mount(MenuContext, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            slots: {
                default: '<div>Test child</div>'
            },
            props: {
                event: new MouseEvent('click')
            }
        });

        expect(wrapper.html()).toContain('Test child');
    });

    it('если slot не указан, то рендерится fallback контент', () => {
        const wrapper = mount(MenuContext, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            props: {
                event: new MouseEvent('click')
            }
        });

        expect(wrapper.html()).toContain('test 1');
    });

    it('закрывается при потере фокуса', async () => {
        const wrapper = mount(MenuContext, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            props: {
                event: new MouseEvent('click')
            },
            attachTo: document.body
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.element).toBe(document.activeElement);

        await wrapper.trigger('blur');

        expect(wrapper.emitted().close).toBeDefined();
    });
});