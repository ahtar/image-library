import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import ScreenInit from '@/components/ScreenInit.vue'
import { useInitStore } from '@/store/modals/modal-init'

jest.mock('@/composables/file-system')

describe('ScreenInit.vue', () => {
    it('Компонент активен, если браузер поддерживает функционал.', () => {
        const pinia = createTestingPinia();
        const store = useInitStore();
        (store.checkCompatibility as any) = true;

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            }
        });

        expect(wrapper.html()).toContain('Due to a restriction of the File System Access API');
    });

    it('Компонент не активен, если браузер не поддерживает функционал.', () => {
        const pinia = createTestingPinia();
        const store = useInitStore();
        (store.checkCompatibility as any) = false;

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            }
        });

        expect(wrapper.html()).toContain('Данный браузер не поддерживает функционал этого сайта.');
    });

    it('коллекции загружаются', async () => {

        const pinia = createTestingPinia();
        const store = useInitStore();
        (store.checkCompatibility as any) = true;

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            }
        });

        await wrapper.vm.$forceUpdate();

        await userEvent.click(wrapper.find('button').element);

        expect(wrapper.emitted().data).toBeDefined();
    });
});