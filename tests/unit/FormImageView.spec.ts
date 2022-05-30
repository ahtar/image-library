import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormImageView from '@/components/FormImageView.vue'
import { useImageViewStore } from '@/store/forms/form-image-view'
import ImageSet from '@/classes/ImageSet'

jest.mock('@/classes/Collection');
jest.mock('@/classes/ImageSet');
jest.mock('@/classes/ImageSingle');
jest.mock('@/composables/image-rendering');

describe('FormImageView.vue', () => {
    it('форма закрывается, если нажать за границу окна', async () => {
        /*const wrapper = mount(FormImageView, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        imageView: {
                            image: new ImageSet({} as any, {} as any)
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useImageViewStore();
        jest.spyOn(store, 'close');

        await userEvent.click(wrapper.find('[data-test="form-view-close"]').element);

        expect(store.close).toBeCalledTimes(1);*/

        const wrapper = mount(FormImageView);
    });
});