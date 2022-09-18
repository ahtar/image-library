import { mount, VueWrapper } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormImageCreate from '@/components/FormImageCreate.vue';
import InputImage from '@/components/InputImage.vue';

import { useImageCreateStore } from '@/store/forms/form-create-image';
import Collection from '@/classes/Collection';

jest.mock('@/classes/Collection');
jest.mock('@/composables/clipboard');
jest.mock('@/modules/jimp.ts');
jest.mock('@/composables/image-rendering');

describe('FormImageCreate.vue', () => {
    let wrapper: VueWrapper<any>;
    let collection: Collection;

    beforeEach(() => {
        collection = new Collection(jest.fn(), {} as any, {} as any);
        wrapper = mount(FormImageCreate, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            collections: {
                                activeCollection: collection,
                            },
                        },
                    }),
                ],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[data-test="modal"]').exists()).toBe(true);
    });

    it('Теги Добавляются', async () => {
        const storeImages = useImageCreateStore();

        await wrapper
            .find<HTMLInputElement>('[data-test="input-tags"] input')
            .setValue('test');
        wrapper
            .find<HTMLInputElement>('[data-test="input-tags"] input')
            .element.focus();
        expect(
            wrapper.find<HTMLInputElement>('[data-test="input-tags"] input')
                .element.value
        ).toBe('test');

        await userEvent.keyboard('{Enter}');
        expect(
            wrapper.find<HTMLInputElement>('[data-test="input-tags"] input')
                .element.value
        ).toBe('');
        expect(storeImages.form.tags.length).toBe(1);
    });

    it('данные формы сбрасываются', async () => {
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'clearForm');

        await userEvent.click(wrapper.find('[data-test="form-clear"]').element);

        expect(storeImages.clearForm).toBeCalledTimes(1);
    });

    it('форма закрывается, если нажать за границу окна', async () => {
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'close');

        await userEvent.click(
            wrapper.find('[data-test="form-create-wrapper"]').element
        );
        expect(storeImages.close).toBeCalledTimes(0);

        await userEvent.click(wrapper.find('[data-test="modal"]').element);
        expect(storeImages.close).toBeCalledTimes(1);
    });

    it('изображение вставляется', async () => {
        const input = wrapper.find<HTMLInputElement>(
            '[data-test="input-file"]'
        );

        //пользователь загружает файл
        await userEvent.upload(
            input.element,
            new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
        );

        expect(wrapper.findComponent(InputImage).emitted().paste).toBeDefined();
        expect(wrapper.find<HTMLImageElement>('img').element.src).toBeTruthy();
    });

    it('видео вставляется', async () => {
        const input = wrapper.find<HTMLInputElement>(
            '[data-test="input-file"]'
        );

        //пользователь загружает файл
        await userEvent.upload(
            input.element,
            new File(['(⌐□_□)'], 'chucknorris.mp4', { type: 'video/mp4' })
        );

        expect(wrapper.findComponent(InputImage).emitted().paste).toBeDefined();
        expect(
            wrapper.find<HTMLSourceElement>('source').element.src
        ).toBeTruthy();
    });

    it('форма сохраняется, если изображение вставлено', async () => {
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'submitImage');

        storeImages.form.file = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
        });

        await userEvent.click(wrapper.find('[data-test="form-save"]').element);

        expect(storeImages.submitImage).toBeCalledTimes(1);
    });

    it('форма не сохраняется, если изображение не вставлено', async () => {
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'submitImage');

        await userEvent.click(wrapper.find('[data-test="form-save"]').element);

        expect(storeImages.submitImage).toBeCalledTimes(0);
        expect(wrapper.emitted().saveImage).not.toBeDefined();
    });

    it('Окно с тегами предыдущего изображения не активно, если ни 1 изображение ещё не было создано в этой сессии', () => {
        expect(
            wrapper.find('[data-test="old-tags"]').exists()
        ).not.toBeTruthy();
    });

    it('Окно с тегами предыдущего изображения активно, если в сессии уже было создано новое изображение', async () => {
        collection.lastTags.push(
            ...[
                { name: 'test tag 1', count: 1 },
                { name: 'test tag 2', count: 1 },
                { name: 'test tag 3', count: 1 },
            ]
        );
        await wrapper.setProps({ priorTags: collection.lastTags });

        expect(wrapper.find('[data-test="old-tags"]').exists()).toBeTruthy();
    });

    it('Старые теги можно добавить', async () => {
        collection.lastTags.push(
            ...[
                { name: 'test tag 1', count: 1 },
                { name: 'test tag 2', count: 1 },
                { name: 'test tag 3', count: 1 },
            ]
        );
        await wrapper.setProps({ priorTags: collection.lastTags });

        const storeImages = useImageCreateStore();

        expect(storeImages.form.tags.length).toBe(0);

        await userEvent.click(
            wrapper.find('[data-test="old-tags"]').element.children[0]
        );

        expect(storeImages.form.tags.length).toBe(1);
    });

    it('Окно со старыми тегами пропадает, если использованы все старые теги', async () => {
        collection.lastTags.push(...[{ name: 'test tag 1', count: 1 }]);
        await wrapper.setProps({ priorTags: collection.lastTags });

        expect(wrapper.find('[data-test="old-tags"]').exists()).toBeTruthy();

        await userEvent.click(
            wrapper.find('[data-test="old-tags"]').element.children[0]
        );

        expect(
            wrapper.find('[data-test="old-tags"]').exists()
        ).not.toBeTruthy();
    });
});
