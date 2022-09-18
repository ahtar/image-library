import { mount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import TransitionFade from '@/components/TransitionFade.vue';

describe('TransitionFade.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(TransitionFade, {
            global: {
                plugins: [createTestingPinia({})],
            },
            slots: {
                default: '<div>Test slot content</div>',
            },
        });
    });

    it('slot рендерится', () => {
        expect(wrapper.html()).toContain('Test slot content');
    });
});
