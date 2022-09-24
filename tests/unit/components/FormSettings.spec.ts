import { mount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';

import FormSettings from '@/components/FormSettings.vue';
import { useSettings } from '@/store/settings'

describe('FormSettings.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(FormSettings, {
            global: {
                plugins: [
                    createTestingPinia(),
                ],
            }
        });
    });

    it('Рендерится', () => {
        expect(wrapper.find('[data-test="form-settings"]').exists()).toBeTruthy();
    });

    it('значение tooltips меняется', async () => {
        const store = useSettings();
        const checkbox = wrapper.find<HTMLInputElement>('[data-test="form-settings"] input');

        expect(store.showTooltips).toBeTruthy();
        expect(checkbox.element.checked).toBeTruthy();
        
        await userEvent.click(checkbox.element);
        await checkbox.trigger('change');

        expect(checkbox.element.checked).toBeFalsy();
        expect(store.showTooltips).toBeFalsy();
    });
});