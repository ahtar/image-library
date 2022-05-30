import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormCollectionCreate from '@/components/FormCollectionCreate.vue'
import InputImage from '@/components/InputImage.vue'
import ModalDark from '@/components/ModalDark.vue'

import { useCollectionCreateStore } from '@/store/forms/form-collection-create'


describe('FormCollectionCreate.vue', () => {
    it('название коллекции вводится', () => {
        const wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const store = useCollectionCreateStore();

        expect(store.form.name).toBe('');

        wrapper.find('#input-name').find('input').setValue('collection name');
        wrapper.find('#input-name').find('input').trigger('input');

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

        wrapper.find('#input-theme').find('input').setValue('collection theme');
        wrapper.find('#input-theme').find('input').trigger('input');

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

        wrapper.find('#input-desc').find('textarea').setValue('collection description');
        wrapper.find('#input-desc').find('textarea').trigger('input');

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

        await userEvent.click(wrapper.find('#form-clear').element);

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

        expect(store.form.name).not.toBeTruthy();
        expect(wrapper.vm.saveButtonActive).not.toBeTruthy();

        await userEvent.click(wrapper.find('#form-save').element);

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


        wrapper.find('#input-name').find('input').setValue('collection name');

        expect(wrapper.vm.saveButtonActive).toBeTruthy();
        expect(store.form.name).toBeTruthy();

        await userEvent.click(wrapper.find('#form-save').element);

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

        await userEvent.click(wrapper.find('.content-wrapper').element);
        await userEvent.click(wrapper.findComponent(InputImage).element);

        expect(store.close).not.toBeCalled();

        await userEvent.click(wrapper.findComponent(ModalDark).element);


        expect(store.close).toBeCalledTimes(1);
    });

});