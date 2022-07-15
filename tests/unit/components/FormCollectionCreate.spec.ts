import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormCollectionCreate from '@/components/FormCollectionCreate.vue'
import InputImage from '@/components/InputImage.vue'
import ModalDark from '@/components/ModalDark.vue'
import InputCheckBox from '@/components/InputCheckBox.vue'

import { useCollectionCreateStore } from '@/store/forms/form-collection-create'

jest.mock('@/composables/clipboard');
jest.mock('@/composables/image-rendering');

globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();


describe('FormCollectionCreate.vue', () => {
    it('название коллекции вводится', () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();

        expect(store.form.name).toBe('');

        wrapper.find('[data-test="collection-create-name"] input').setValue('collection name');

        expect(store.form.name).toBe('collection name');
    });

    it('тема коллекции вводится', () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();

        expect(store.form.theme).toBe('');

        wrapper.find('[data-test="collection-create-theme"] input').setValue('collection theme');

        expect(store.form.theme).toBe('collection theme');

    });

    it('описание коллекции вводится', () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();

        expect(store.form.description).toBe('');

        wrapper.find('[data-test="collection-create-description"] textarea').setValue('collection description');

        expect(store.form.description).toBe('collection description');

    });

    it('данные коллекции сбрасываются', async () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'clearForm');

        await userEvent.click(wrapper.find('[data-test="collection-create-clear"]').element);

        expect(store.clearForm).toBeCalledTimes(1);

    });

    it('коллекция не сохраняется, если название не введено', async () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'createCollection');

        expect(store.form.name).toBeFalsy();

        await userEvent.click(wrapper.find('[data-test="collection-create-save"]').element);

        expect(store.createCollection).toBeCalledTimes(0);

    });

    it('коллекция сохраняется, если название введено', async () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'createCollection');


        wrapper.find('[data-test="collection-create-name"] input').setValue('collection name');
        await userEvent.click(wrapper.find('[data-test="collection-create-save"]').element);

        expect(store.createCollection).toBeCalledTimes(1);

    });

    it('форма закрывается, если нажать за границу окна', async () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'close');

        //при нажании в границе окна, окно не закрывается
        await userEvent.click(wrapper.find('[data-test="collection-create-wrapper"]').element);
        await userEvent.click(wrapper.findComponent(InputImage).element);
        expect(store.close).not.toBeCalled();

        //при нажатии за границу окна, окно закроется
        await userEvent.click(wrapper.findComponent(ModalDark).element);
        expect(store.close).toBeCalledTimes(1);
    });

    it('Изображение вставляется', async () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
            attachTo: document.body
        });
        const user = userEvent.setup();

        //src изображения это пустая строка, следовательно изображение не отрисовано
        expect(wrapper.find<HTMLImageElement>('img').element.src).toBe('');

        //пользователь жмет на элемент и вставляет изображение из буфера обмена
        await userEvent.click(wrapper.find<HTMLElement>('[data-test="collection-create-image"]').element);
        await user.paste();

        //src изображения меняется с пустой строки, следовательно это изображение отрисовано
        expect(wrapper.find<HTMLImageElement>('img').element.src).not.toBe('');
    });

    it('Настройка corrupted меняется', async () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            }
        });
        const store = useCollectionCreateStore();
        const checkbox = wrapper.find<HTMLInputElement>('[data-test="collection-create-corrupted"] input');

        expect(checkbox.element.checked).toBe(false);
        expect(store.form.options.corrupted).toBe(false);

        await userEvent.click(checkbox.element);
        await checkbox.trigger('change');

        expect(checkbox.element.checked).toBe(true);
        expect(store.form.options.corrupted).toBe(true);
    });

});