import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import TransitionFadeGroup from '@/components/TransitionFadeGroup.vue';

describe('TransitionFadeGroup.vue', () => {
    it('slot рендерится', () => {
        const wrapper = mount(TransitionFadeGroup, {
            global: {
                plugins: [createTestingPinia({})],
            },
            slots: {
                default: '<div>Test slot content</div>',
            },
            props: {
                items: [{ manifest: { id: 1 } }],
            },
        });

        expect(wrapper.html()).toContain('Test slot content');
    });
});
