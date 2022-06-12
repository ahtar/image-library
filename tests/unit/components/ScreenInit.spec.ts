import { mount, shallowMount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import ScreenInit from '@/components/ScreenInit.vue'

jest.mock('@/composables/file-system')

describe('ScreenInit.vue', () => {
    it('Компонент рендерится', () => {
        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [createTestingPinia({
                })],
            }
        });

        expect(wrapper.html()).toContain('Due to a restriction of the File System Access API and Permissions API');
    });

    it('коллекции загружаются', async () => {
        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [createTestingPinia({
                })],
            }
        });

        await userEvent.click(wrapper.find('button').element);

        expect(wrapper.emitted().data).toBeDefined();
    });
});