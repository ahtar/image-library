import { mount, VueWrapper } from '@vue/test-utils';
import { VueNode } from '@vue/test-utils/dist/types';
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormCollectionCreate from '@/components/FormCollectionCreate.vue';
import InputImage from '@/components/InputImage.vue';
import ModalDark from '@/components/ModalDark.vue';
import tooltip from '@/directives/v-tooltip';

import { useCollectionCreateStore } from '@/store/forms/form-collection-create';

jest.mock('@/composables/clipboard');
jest.mock('@/composables/image-rendering');

describe('FormCollectionCreate.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
                directives: {
                    tooltip: tooltip(),
                },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(
            wrapper.find('[data-test="collection-create-wrapper"]').exists()
        ).toBe(true);
    });

    it('название коллекции вводится', () => {
        const store = useCollectionCreateStore();

        expect(store.form.name).toBe('');

        wrapper
            .find('[data-test="collection-create-name"] input')
            .setValue('collection name');

        expect(store.form.name).toBe('collection name');
    });

    it('тема коллекции вводится', () => {
        const store = useCollectionCreateStore();

        expect(store.form.theme).toBe('');

        wrapper
            .find('[data-test="collection-create-theme"] input')
            .setValue('collection theme');

        expect(store.form.theme).toBe('collection theme');
    });

    it('описание коллекции вводится', () => {
        const store = useCollectionCreateStore();

        expect(store.form.description).toBe('');

        wrapper
            .find('[data-test="collection-create-description"] textarea')
            .setValue('collection description');

        expect(store.form.description).toBe('collection description');
    });

    it('данные коллекции сбрасываются', async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'clearForm');

        await userEvent.click(
            wrapper.find('[data-test="collection-create-clear"]').element
        );

        expect(store.clearForm).toBeCalledTimes(1);
    });

    it('коллекция сохраняется, если название введено и изображение вставленно', async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'createCollection');

        store.form.file = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
        });
        wrapper
            .find('[data-test="collection-create-name"] input')
            .setValue('collection name');

        expect(store.form.file).not.toBeFalsy();
        expect(store.form.name).toBe('collection name');

        await userEvent.click(
            wrapper.find('[data-test="collection-create-save"]').element
        );

        expect(store.createCollection).toBeCalledTimes(1);
    });

    it('форма закрывается, если нажать за границу окна', async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'close');

        await userEvent.click(wrapper.findComponent(ModalDark).element);
        expect(store.close).toBeCalledTimes(1);
    });

    it('форма не закрывается, если нажать в пределах окна', async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, 'close');

        await userEvent.click(
            wrapper.find('[data-test="collection-create-wrapper"]').element
        );
        await userEvent.click(wrapper.findComponent(InputImage).element);
        expect(store.close).not.toBeCalled();
    });

    it('Настройка corrupted меняется', async () => {
        const store = useCollectionCreateStore();
        const checkbox = wrapper.find<HTMLInputElement>(
            '[data-test="collection-create-corrupted"] input'
        );

        expect(checkbox.element.checked).toBe(false);
        expect(store.form.options.corrupted).toBe(false);

        await userEvent.click(checkbox.element);
        await checkbox.trigger('change');

        expect(checkbox.element.checked).toBe(true);
        expect(store.form.options.corrupted).toBe(true);
    });

    it('изображение вставляется', async () => {
        const img = wrapper.find<HTMLImageElement>('img').element;
        const input = wrapper.find<HTMLInputElement>(
            '[data-test="input-file"]'
        );

        //src изображения это пустая строка, следовательно изображение не отрисовано
        expect(img!.src).toBe('');

        //пользователь загружает файл
        await userEvent.upload(
            input.element,
            new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
        );

        //src изображения меняется с пустой строки, следовательно это изображение отрисовано
        expect(img!.src).not.toBe('');
    });

    it('видео не вставляется', async () => {
        const img = wrapper.find<HTMLImageElement>('img').element;
        const input = wrapper.find<HTMLInputElement>(
            '[data-test="input-file"]'
        );

        //src изображения это пустая строка, следовательно изображение не отрисовано
        expect(img!.src).toBe('');

        //пользователь загружает файл
        await userEvent.upload(
            input.element,
            new File(['(⌐□_□)'], 'chucknorris.mp4', { type: 'video/mp4' })
        );

        //src изображения не меняется с пустой строки, следовательно это изображение не отрисовано
        expect(img!.src).toBe('');
    });

    describe('коллекция не сохраняется', () => {
        let wrapper: VueWrapper<any> | null = null;
        let saveButton: VueNode<Element> | null = null;

        beforeEach(() => {
            wrapper = mount(FormCollectionCreate, {
                global: {
                    plugins: [createTestingPinia()],
                    directives: {
                        tooltip: tooltip(),
                    },
                },
            });

            saveButton = wrapper.find(
                '[data-test="collection-create-save"]'
            ).element;
        });

        it('если название не введено и изображение не вставленно', async () => {
            const store = useCollectionCreateStore();
            jest.spyOn(store, 'createCollection');

            expect(store.form.name).toBeFalsy();
            expect(store.form.file).toBeFalsy();

            await userEvent.click(saveButton!);

            expect(store.createCollection).toBeCalledTimes(0);
        });

        it('если название введено и изображение не вставленно', async () => {
            const store = useCollectionCreateStore();
            jest.spyOn(store, 'createCollection');

            wrapper!
                .find('[data-test="collection-create-name"] input')
                .setValue('collection name');

            expect(store.form.file).toBeFalsy();
            expect(store.form.name).toBe('collection name');

            await userEvent.click(saveButton!);

            expect(store.createCollection).toBeCalledTimes(0);
        });

        it('если название не введено и изображение вставленно', async () => {
            const store = useCollectionCreateStore();
            jest.spyOn(store, 'createCollection');

            store.form.file = new File(['(⌐□_□)'], 'chucknorris.png', {
                type: 'image/png',
            });

            expect(store.form.file).not.toBeFalsy();
            expect(store.form.name).toBeFalsy();

            await userEvent.click(saveButton!);

            expect(store.createCollection).toBeCalledTimes(0);
        });
    });
});
