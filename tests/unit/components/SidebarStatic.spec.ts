import { mount, VueWrapper } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import SidebarStatic from '@/components/SidebarStatic.vue'

describe('SidebarStatic.vue', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        wrapper = mount(SidebarStatic, {
            slots: {
                default: '<p>test text</p>'
            }
        });
    });

    it('компонент рендерится', () => {
        expect(wrapper.find<HTMLDivElement>('div').exists()).toBeTruthy();
    });

    it('slot рендерится', () => {
        expect(wrapper.text()).toBe('test text');
    });
});