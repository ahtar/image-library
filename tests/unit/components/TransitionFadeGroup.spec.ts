import { mount, shallowMount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import TransitionFadeGroup from '@/components/TransitionFadeGroup.vue'

describe('TransitionFadeGroup.vue', () => {
    it('slot рендерится', () => {
        const wrapper = mount(TransitionFadeGroup, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            slots: {
                default: '<div>Test slot content</div>'
            },
            props: {
                items: [{manifest: {id: 1}}]
            }
        });

        expect(wrapper.html()).toContain('Test slot content');
    });

    it('slot рендерится как список props.items', () => {
        const wrapper = mount(TransitionFadeGroup, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            slots: {
                default: '<p>Test slot content</p>'
            },
            props: {
                items: [{manifest: {id: 1}}, {manifest: {id: 2}}, {manifest: {id: 3}}]
            }
        });

        expect(wrapper.findAll('p').length).toBe(3);
    });
});