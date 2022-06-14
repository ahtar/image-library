import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormCollectionEdit from '@/components/FormCollectionEdit.vue'
import { useCollectionEditStore } from '@/store/forms/form-collection-edit'

import Collection from '@/classes/Collection'

jest.mock('@/classes/Collection');
jest.mock('@/composables/clipboard');
jest.mock('@/modules/jimp.ts');
jest.mock('@/composables/image-rendering');

globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();

describe('FormCollectionEdit', () => {
    it('форма закрывается', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
        });
        const store = useCollectionEditStore();
        jest.spyOn(store, 'close');
        await wrapper.vm.$nextTick();

        await userEvent.click(wrapper.find('[data-test="modal"]').element);

        expect(store.close).toBeCalledTimes(1);
    });

    it('название вводится', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
        });
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.name).toBe('mock name');
        await wrapper.find<HTMLInputElement>('[data-test="collection-edit-name"] input').setValue('new name');
        expect(store.form.name).toBe('new name');
    });

    it('тема вводится', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
        });
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.theme).toBe('mock theme');
        await wrapper.find<HTMLInputElement>('[data-test="collection-edit-theme"] input').setValue('new theme');
        expect(store.form.theme).toBe('new theme');
    });

    it('описание вводится', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
        });
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.description).toBe('mock description');
        await wrapper.find<HTMLInputElement>('[data-test="collection-edit-description"] textarea').setValue('new description');
        expect(store.form.description).toBe('new description');
    });

    it('изображение меняется', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useCollectionEditStore();
        const user = userEvent.setup();
        await wrapper.vm.$nextTick();

        const imgSrc = wrapper.find<HTMLImageElement>('img').element.src;

        expect(imgSrc).not.toBe('');

        await userEvent.click(wrapper.find<HTMLElement>('[data-test="collection-edit-image"]').element);
        await user.paste();

        expect(wrapper.find<HTMLImageElement>('img').element.src).not.toBe('');
        expect(wrapper.find<HTMLImageElement>('img').element.src).not.toBe(imgSrc);
    });

    it('изменения в коллекции сохраняются', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useCollectionEditStore();
        jest.spyOn(store, 'save');
        await wrapper.vm.$nextTick();

        await userEvent.click(wrapper.find<HTMLButtonElement>('button').element);
        expect(store.save).toBeCalledTimes(1);
    });

    it('изменения в коллекции не сохраняются, если название коллекции не введено', async () => {
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collectionEdit: {
                            visible: true,
                            form: {
                                name: 'mock name',
                                theme: 'mock theme',
                                description: 'mock description',
                                blob: new Blob()
                            },
                            collection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useCollectionEditStore();
        jest.spyOn(store, 'save');
        await wrapper.vm.$nextTick();

        await wrapper.find<HTMLInputElement>('[data-test="collection-edit-name"] input').setValue('');
        await userEvent.click(wrapper.find<HTMLButtonElement>('button').element);
        expect(store.save).toBeCalledTimes(0);
    });
});