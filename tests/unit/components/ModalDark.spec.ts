import { mount, shallowMount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import ModalDark from '@/components/ModalDark.vue'

describe('ModalDark.vue', () => {
    it('slot рендерится', () => {
        const wrapper = mount(ModalDark, {
            global: {
                plugins: [createTestingPinia({
                })]
            },
            slots: {
                default: '<div>test content</div>'
            }
        });

        expect(wrapper.html()).toContain('test content');
    });

    it('закрывается', async () => {
        const wrapper = mount(ModalDark, {
            global: {
                plugins: [createTestingPinia({
                })]
            }
        });

        await userEvent.click(wrapper.element);

        expect(wrapper.emitted().close).toBeDefined();
    });
});