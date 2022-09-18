import { mount, shallowMount, VueWrapper } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import ScrollBar from '@/components/ScrollBar.vue';

describe('ScrollBard.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ScrollBar, {
            global: {
                plugins: [createTestingPinia({})],
            },
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('[class="scroll-component"]').exists()).toBe(true);
    });

    it('emit scroll при нажатии', async () => {
        await userEvent.click(wrapper.element);

        expect(wrapper.emitted().scroll).toBeDefined();
    });
});
