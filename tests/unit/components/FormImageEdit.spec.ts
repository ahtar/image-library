import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormImageEdit from '@/components/FormImageEdit.vue'
import Collection from '@/classes/Collection';
import ImageSet from '@/classes/ImageSet'
import ImageSingle from '@/classes/ImageSingle'
import SelectImage from '@/components/SelectImage.vue'

import { useImageEditStore } from '@/store/forms/form-image-edit'
import { useCollections } from '@/store/collections'


jest.mock('@/classes/Collection');
jest.mock('@/classes/ImageSet');
jest.mock('@/classes/ImageSingle');
jest.mock('@/composables/image-rendering');

describe('FormImageEdit.vue', () => {
    it('форма закрывается при нажатии за границу формы', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useImageEditStore();
        jest.spyOn(store, 'close');

        await userEvent.click(wrapper.find('[data-test="form-edit-close"]').element);

        expect(store.close).toBeCalledTimes(1);
        expect(wrapper.emitted().updateImage).toBeDefined();

    });

    it('новый тег добавляется', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image: new ImageSingle({} as any, [] as any),
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useImageEditStore();

        //Изначально в изменяемом изображении есть 2 тега
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //пользователь вводит тег и жмет Enter
        await wrapper.find('[data-test="input-tags"] input').setValue('test');
        wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.focus();
        await userEvent.keyboard('{Enter}');

        //новый тег должен добавиться, всего будет 3 тега
        expect(wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.value).toBe('');
        expect((store.image as ImageSingle).manifest.tags.length).toBe(3);
    });

    it('повторный тег не добавляется', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image: new ImageSingle({} as any, [] as any),
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useImageEditStore();

        //Изначально в изменяемом изображении есть 2 тега
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //пользователь вводит уже существующий тег и жмет Enter
        await wrapper.find('[data-test="input-tags"] input').setValue('mock tag 1');
        wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.focus();
        await userEvent.keyboard('{Enter}');

        //этот тег не должен добавиться, так как он уже существует в этом изображении
        expect(wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element.value).toBe('');
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);
    });

    it('тег удаляется при нажатии на него', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image: new ImageSingle({} as any, [] as any),
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        const store = useImageEditStore();
        await wrapper.vm.$nextTick();

        //изначально в изменяемом изображении есть 2 тега
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //пользователь жмет на первый тег
        await userEvent.click(wrapper.find('[data-test="tag-container"]').element);

        //этот тег удаляется, в изображении остается 1 тег
        expect((store.image as ImageSingle).manifest.tags.length).toBe(1);
    });

    it('активное изображение менятся', async () => {
        //изменяемое изображение
        const image = new ImageSet({} as any, [] as any);
        image.arr[0].manifest.tags = ['1 tag', '2 tag', '3 tag'];
        image.arr[1].manifest.tags = ['11 tag', '12 tag', '13 tag'];
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        await wrapper.vm.$nextTick();

        let imgSrc = wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src;
        let firstTag = wrapper.find<HTMLElement>('[data-test="tag-container"]').text();

        //пользователь выбирает 2 изображение в списке изображений
        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[1].element);
        //src нового изображения не должен быть равен src предыдущего изображения
        expect(wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src).not.toBe(imgSrc);
        //теги нового изображения не должны быть равны тегам предыдущего изображения
        expect(wrapper.find<HTMLElement>('[data-test="tag-container"]').text()).not.toBe(firstTag);
        imgSrc = wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src;
        firstTag = wrapper.find<HTMLElement>('[data-test="tag-container"]').text();

        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[0].element);
        expect(wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src).not.toBe(imgSrc);
        expect(wrapper.find<HTMLElement>('[data-test="tag-container"]').text()).not.toBe(firstTag);
    });
    
    it('активное изображение меняется, и меняются теги во всех изображениях', async () => {
        const image = new ImageSet({} as any, [] as any);
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image,
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        await wrapper.vm.$nextTick();
        //изначально активно первое изображение и в нем есть 2 тега.
        expect(wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length).toBe(2);

        //добавляем новый тег.
        //в активном изображении теперь 3 тега.
        await wrapper.find('[data-test="input-tags"] input').setValue('test');
        wrapper.find<HTMLElement>('[data-test="input-tags"] input').element.focus();
        await userEvent.keyboard('{Enter}');
        expect(wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length).toBe(3);

        //делаем активным второе изображение и удаляем из него 1 тег.
        //в активном изображении теперь 1 тег.
        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[1].element);
        expect(wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length).toBe(2);

        await userEvent.click(wrapper.find('[data-test="tag-container"]').element);
        expect(wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length).toBe(1);
    });

    it('изображения меняются местами', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image: new ImageSet({} as any, [] as any)
                        }
                    }
                })],
            }
        });
        await wrapper.vm.$nextTick();
        const store = useImageEditStore();
        const firstImage = (store.image as ImageSet).arr[0];

        wrapper.findComponent(SelectImage).vm.$emit('dragSort', {fromIndex: 1, toIndex: 0});

        expect((store.image as ImageSet).arr[0]).not.toBe(firstImage);
    });

    it('отдельное изображение отделяется от сета', async () => {
        const collection = new Collection(jest.fn(), {} as any, {} as any);
        const image = new ImageSet({} as any, [] as any);
        collection.addImage(image);
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: collection
                        },
                        imageEdit: {
                            image
                        }
                    }
                })],
            }
        });
        const store = useImageEditStore();
        const collectionStore = useCollections();
        await wrapper.vm.$nextTick();

        //в активной коллекции должно быть 1 изображение.
        expect(collectionStore.activeCollection?.arr.length).toBe(1);

        //добавляем 3 изображение в сет, чтобы сет не разделился
        (store.image as ImageSet).addImage(new ImageSingle({} as any, {} as any));
        expect((store.image as ImageSet).arr.length).toBe(3);

        //жмем кнопку удаления изображения в сете
        await userEvent.click(wrapper.find('[data-test="form-edit-remove-image"]').element);

        //из сета удаляется 1 изображение, теперь в сете 2 изображения
        expect((store.image as ImageSet).arr.length).toBe(2);
        //в активной коллекции теперь 2 изображения
        expect(collectionStore.activeCollection?.arr.length).toBe(2);
    });

    it('сет разделяется на отдельные изображения', async () => {
        const collection = new Collection(jest.fn(), {} as any, {} as any);
        const image = new ImageSet({} as any, [] as any);
        image.addImage(new ImageSingle({} as any, {} as any));
        collection.addImage(image);
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: collection
                        },
                        imageEdit: {
                            image
                        }
                    }
                })],
            }
        });
        const store = useImageEditStore();
        const collectionStore = useCollections();
        await wrapper.vm.$nextTick();

        //в активной коллекции должно быть 1 изображение.
        expect(collectionStore.activeCollection?.arr.length).toBe(1);

        //изначальное в сете 3 изображения
        expect((store.image as ImageSet).arr.length).toBe(3);

        //жмем кнопку удаления изображения в сете
        await userEvent.click(wrapper.find('[data-test="form-edit-remove-image"]').element);

        expect((store.image as ImageSet).arr.length).toBe(2);
        expect(collectionStore.activeCollection?.arr.length).toBe(2);

        //жмем кнопку удаления изображения в сете
        await userEvent.click(wrapper.find('[data-test="form-edit-remove-image"]').element);

        //сет должен разделиться на 2 отдельных изображения
        expect((store.image as ImageSet).arr.length).toBe(0);
        //в активной коллекции теперь 3 изображения
        expect(collectionStore.activeCollection?.arr.length).toBe(3);
    });

    it('изображение рендерится', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image: new ImageSet({} as any, [] as any),
                        }
                    }
                })],
            }
        });
        await wrapper.vm.$nextTick();

        //Изображение получает src и рендерится
        expect(wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src).not.toBe('');
    });

    it('Изображение ререндерится при смене активного изображения', async () => {
        const wrapper = mount(FormImageEdit, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        collections: {
                            activeCollection: new Collection(jest.fn(), {} as any, {} as any)
                        },
                        imageEdit: {
                            image: new ImageSet({} as any, [] as any),
                        }
                    }
                })],
            }
        });
        await wrapper.vm.$nextTick();

        const firstImageSrc = wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src;

        //Изначальное зображение получает src и рендерится
        expect(firstImageSrc).not.toBe('');

        //меняем активное изображение
        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[1].element);

        //новое изображение рендерится, src нового изображения не равен src старого изображения
        expect(wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src).not.toBe(firstImageSrc);
    });
});
