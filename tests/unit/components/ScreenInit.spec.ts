import { mount } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestingPinia, TestingPinia } from '@pinia/testing';

import ScreenInit from '@/components/ScreenInit.vue';
import { useInitStore } from '@/store/modals/modal-init';
import { useCollections } from '@/store/collections';
import { useSettings } from '@/store/settings';

jest.mock('@/modules/file-system');
jest.mock('@/locales/i18n');

describe('ScreenInit.vue', () => {
    let pinia: TestingPinia;
    beforeEach(() => {
        pinia = createTestingPinia();
    })
    it('рендерится', () => {
        const store = useInitStore();
        (store.checkCompatibility as any) = true;

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            },
        });

        expect(wrapper.find('[data-test="screen-init"]').exists()).toBe(true);
    });

    it('Компонент активен, если браузер поддерживает функционал.', () => {
        const store = useInitStore();
        (store.checkCompatibility as any) = true;

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            },
        });

        expect(wrapper.html()).toContain('INIT_SCREEN.MESSAGE');
    });

    it('Компонент не активен, если браузер не поддерживает функционал.', () => {
        const store = useInitStore();
        (store.checkCompatibility as any) = false;

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            },
        });

        expect(wrapper.html()).toContain('INIT_SCREEN.BROWSER_INCOMPATIBLE');
    });

    it('коллекции загружаются', async () => {
        const store = useInitStore();
        const storeCollections = useCollections();
        const storeSettings = useSettings();
        (store.checkCompatibility as any) = true;

        jest.spyOn(storeCollections, 'loadCollections');
        jest.spyOn(store, 'hide');
        jest.spyOn(storeSettings, 'getDirectoryHandle');

        const wrapper = mount(ScreenInit, {
            global: {
                plugins: [pinia],
            },
        });

        await wrapper.vm.$forceUpdate();

        await userEvent.click(wrapper.find('button').element);

        expect(storeCollections.loadCollections).toBeCalledTimes(1);
        expect(store.hide).toBeCalledTimes(1);
        expect(storeSettings.getDirectoryHandle).toBeCalledTimes(1);
    });
});
