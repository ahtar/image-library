import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormImageCreate from '@/components/FormImageCreate.vue'
import InputImage from '@/components/InputImage.vue'

import { useImageCreateStore } from '@/store/forms/form-create-image'
import Collection from '@/classes/Collection';

jest.mock('@/classes/Collection');
jest.mock('@/composables/clipboard');
jest.mock('@/modules/jimp.ts');
jest.mock('@/composables/image-rendering');


globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();


describe('FormImageCreate.vue', () => {
    it('Теги Добавляются', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body
        });
        const storeImages = useImageCreateStore();

        await wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').setValue('test');
        wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.focus();
        expect(wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.value).toBe('test');

        await userEvent.keyboard('{Enter}');
        expect(wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.value).toBe('');
        expect(storeImages.form.tags.length).toBe(1);
    });

    it('данные формы сбрасываются', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            }
        });
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'clearForm');

        await userEvent.click(wrapper.find('[data-test="form-clear"]').element);

        expect(storeImages.clearForm).toBeCalledTimes(1);
    });

    it('форма закрывается, если нажать за границу окна', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            }
        });
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'close');

        await userEvent.click(wrapper.find('[data-test="form-create-wrapper"]').element);
        expect(storeImages.close).toBeCalledTimes(0);

        await userEvent.click(wrapper.find('[data-test="modal"]').element);
        expect(storeImages.close).toBeCalledTimes(1);
    });

    it('изображение вставляется', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body
        });
        const user = userEvent.setup();
        const storeImages = useImageCreateStore();

        expect(storeImages.form.blob).not.toBeDefined();

        //пользователь жмет на элемент и вставляет изображение из буфера обмена
        await userEvent.click(wrapper.find<HTMLElement>('[data-test="input-image"]').element);
        await user.paste();

        expect(wrapper.findComponent(InputImage).emitted().paste).toBeDefined();
        expect(storeImages.form.blob).toBeDefined();
    });

    it('изображение рендерится, если оно вставлено', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body
        });
        const storeImages = useImageCreateStore();

        //изначально img.src Должен быть не задан
        expect(wrapper.find<HTMLImageElement>('[data-test="input-image"] img').element.src).toBe('');

        //Вставляем изображение
        storeImages.form.blob = new Blob();
        await wrapper.vm.$nextTick();

        //img.src Должен обновиться
        expect(wrapper.find<HTMLImageElement>('[data-test="input-image"] img').element.src).not.toBe('');
    });

    it('форма сохраняется, если изображение вставлено', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body
        });
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'submitImage');

        storeImages.form.blob = new Blob();

        await userEvent.click(wrapper.find('[data-test="form-save"]').element);

        expect(storeImages.submitImage).toBeCalledTimes(1);
    });

    it('форма не сохраняется, если изображение не вставлено', async () => {
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body
        });
        const storeImages = useImageCreateStore();
        jest.spyOn(storeImages, 'submitImage');

        await userEvent.click(wrapper.find('[data-test="form-save"]').element);

        expect(storeImages.submitImage).toBeCalledTimes(0);
        expect(wrapper.emitted().saveImage).not.toBeDefined();
    });

    it('Окно с тегами предыдущего изображения не активно, если ни 1 изображение ещё не было создано в этой сессии', () => {
        const collection = new Collection(jest.fn(), {} as any, {} as any);
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: collection
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
            },
            attachTo: document.body
        });

        expect(wrapper.find('[data-test="old-tags"]').exists()).not.toBeTruthy();
    });

    it('Окно с тегами предыдущего изображения активно, если в сессии уже было создано новое изображение', () => {
        const collection = new Collection(jest.fn(), {} as any, {} as any);
        collection.lastTags.push(...[{ name: 'test tag 1', count: 1 }, { name: 'test tag 2', count: 1 }, { name: 'test tag 3', count: 1 }]);
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: collection
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
                priorTags: collection.lastTags
            },
            attachTo: document.body
        });

        expect(wrapper.find('[data-test="old-tags"]').exists()).toBeTruthy();
    });

    it('Старые теги можно добавить', async () => {
        const collection = new Collection(jest.fn(), {} as any, {} as any);
        collection.lastTags.push(...[{ name: 'test tag 1', count: 1 }, { name: 'test tag 2', count: 1 }, { name: 'test tag 3', count: 1 }]);
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: collection
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
                priorTags: collection.lastTags
            },
            attachTo: document.body
        });
        const storeImages = useImageCreateStore();

        expect(storeImages.form.tags.length).toBe(0);

        await userEvent.click(wrapper.find('[data-test="old-tags"]').element.children[0]);

        expect(storeImages.form.tags.length).toBe(1);
    });

    it('Окно со старыми тегами пропадает, если использованы все старые теги', async () => {
        const collection = new Collection(jest.fn(), {} as any, {} as any);
        collection.lastTags.push(...[{ name: 'test tag 1', count: 1 }]);
        const wrapper = mount(FormImageCreate, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: collection
                        }
                    }
                })],
            },
            props: {
                definedTags: [],
                priorTags: collection.lastTags
            },
            attachTo: document.body
        });
        expect(wrapper.find('[data-test="old-tags"]').exists()).toBeTruthy();

        await userEvent.click(wrapper.find('[data-test="old-tags"]').element.children[0]);

        expect(wrapper.find('[data-test="old-tags"]').exists()).not.toBeTruthy();
    });
});