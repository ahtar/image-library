import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import FormImageEdit from '@/components/FormImageEdit.vue'
import Collection from '@/classes/Collection';
import ImageSet from '@/classes/ImageSet'
import ImageSingle from '@/classes/ImageSingle'
import SelectImage from '@/components/SelectImage.vue'
import { VueNode } from "@vue/test-utils/dist/types";

import { useImageEditStore } from '@/store/forms/form-image-edit'


jest.mock('@/classes/Collection');
jest.mock('@/classes/ImageSet');
jest.mock('@/classes/ImageSingle');
jest.mock('@/composables/image-rendering')

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
        jest.spyOn(wrapper.vm, 'close');
        //https://stackoverflow.com/questions/61859423/why-doesnt-jest-spyon-sometimes-work-on-a-vue-components-method
        await wrapper.vm.$forceUpdate();

        await userEvent.click(wrapper.find('[data-test="form-edit-close"]').element);

        expect(wrapper.vm.close).toBeCalledTimes(1);

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

        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        await wrapper.find('[data-test="input-tags"] input').setValue('test');
        (wrapper.find('[data-test="input-tags"] input').element as VueNode<HTMLElement>).focus();

        expect(wrapper.find('[data-test="input-tags"] input').element).toBe(document.activeElement);
        expect((wrapper.find('[data-test="input-tags"] input').element as VueNode<HTMLInputElement>).value).toBe('test');

        await userEvent.keyboard('{Enter}');

        expect((wrapper.find('[data-test="input-tags"] input').element as VueNode<HTMLInputElement>).value).toBe('');
        expect((store.image as ImageSingle).manifest.tags.length).toBe(3);
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

        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //обновление computed в InputTag
        await wrapper.vm.$forceUpdate();

        await userEvent.click(wrapper.find('[data-test="tag-container"]').element);

        expect((store.image as ImageSingle).manifest.tags.length).toBe(1);
    });

    it('активное изображение менятся', async () => {
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
            },
            attachTo: document.body
        });
        jest.spyOn(wrapper.vm, 'changeActiveImage');
        await wrapper.vm.$forceUpdate();

        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[1].element);
        expect(wrapper.vm.changeActiveImage).toBeCalledTimes(1);

        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[0].element);
        expect(wrapper.vm.changeActiveImage).toBeCalledTimes(2);
    });
    
    it('активное изображение меняется, и меняются теги во всех изображениях', async () => {
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
            },
            attachTo: document.body
        });
        //изначально активно первое изображение и в нем есть 2 тега.
        expect((wrapper.vm.activeImage as ImageSingle).manifest.tags.length).toBe(2);

        //добавляем новый тег.
        //в активном изображении теперь 3 тега.
        await wrapper.find('[data-test="input-tags"] input').setValue('test');
        (wrapper.find('[data-test="input-tags"] input').element as VueNode<HTMLElement>).focus();
        await userEvent.keyboard('{Enter}');
        expect((wrapper.vm.activeImage as ImageSingle).manifest.tags.length).toBe(3);

        //делаем активным изображением второе изображение в сете и удаляем из него 1 тег.
        //в активном изображении теперь 1 тег.
        await userEvent.click(wrapper.findAll('[data-test="select-image-card"]')[1].element);
        expect((wrapper.vm.activeImage as ImageSingle).manifest.tags.length).toBe(2);
        await userEvent.click(wrapper.find('[data-test="tag-container"]').element);
        expect((wrapper.vm.activeImage as ImageSingle).manifest.tags.length).toBe(1);
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
                            image: new ImageSet({} as any, [] as any),
                        }
                    }
                })],
            },
            attachTo: document.body
        });
        jest.spyOn(wrapper.vm, 'dragSort');
        await wrapper.vm.$forceUpdate();

        wrapper.findComponent(SelectImage).vm.$emit('dragSort', {fromIndex: 0, toIndex: 1});

        expect(wrapper.vm.dragSort).toBeCalledTimes(1);
    });

    it('отдельное изображение отделяется от сета', async () => {
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
            },
            attachTo: document.body
        });
        const store = useImageEditStore();
        jest.spyOn(wrapper.vm, 'separateImage');
        await wrapper.vm.$forceUpdate();

        //добавляем 3 изображение в сет, чтобы сет не разделился
        (store.image as ImageSet).addImage(new ImageSingle({} as any, {} as any));
        expect((store.image as ImageSet).arr.length).toBe(3);

        //жмем кнопку удаления изображения в сете
        await userEvent.click(wrapper.find('[data-test="form-edit-remove-image"]').element);

        expect(wrapper.vm.separateImage).toBeCalledTimes(1);
        expect((store.image as ImageSet).arr.length).toBe(2);
    });

    it('сет разделяется на отдельные изображения', async () => {
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
            },
            attachTo: document.body
        });
        const store = useImageEditStore();
        jest.spyOn(wrapper.vm, 'separateImage');
        await wrapper.vm.$forceUpdate();

        //изначальное в сете 2 изображения
        expect((store.image as ImageSet).arr.length).toBe(2);

        //жмем кнопку удаления изображения в сете
        await userEvent.click(wrapper.find('[data-test="form-edit-remove-image"]').element);

        //сет должен разделиться на 2 отдельных изображения
        expect(wrapper.vm.separateImage).toBeCalledTimes(1);
        expect((store.image as ImageSet).arr.length).toBe(0);
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
            },
            attachTo: document.body
        });
        await wrapper.vm.$nextTick();

        //Изображение получает src и рендерится
        expect(wrapper.find<HTMLImageElement>('[data-test="form-edit-image"]').element.src).not.toBe('');
    });

    it('ИЗображение ререндерится при смене активного изображения', async () => {
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
            },
            attachTo: document.body
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
