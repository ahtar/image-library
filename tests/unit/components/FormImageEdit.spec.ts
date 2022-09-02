import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import FormImageEdit from "@/components/FormImageEdit.vue";
import Collection from "@/classes/Collection";
import ImageSet from "@/classes/ImageSet";
import ImageSingle from "@/classes/ImageSingle";
import SelectImage from "@/components/SelectImage.vue";

import { useImageEditStore } from "@/store/forms/form-image-edit";

jest.mock("@/classes/Collection");
jest.mock("@/classes/ImageSet");
jest.mock("@/classes/ImageSingle");
jest.mock("@/composables/image-rendering");
jest.mock("@/composables/clipboard");

describe("FormImageEdit.vue", () => {

    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(FormImageEdit, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            collections: {
                                activeCollection: new Collection(
                                    jest.fn(),
                                    {} as any,
                                    {} as any
                                ),
                            },
                            imageEdit: {
                                image: new ImageSingle({} as any, [] as any),
                            },
                        },
                    }),
                ],
            },
            attachTo: document.body,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[data-test="form-edit-close"]').exists()).toBe(true);
    });

    it("изменение изображения отменяется при нажатии за границу формы", async () => {
        const store = useImageEditStore();
        jest.spyOn(store, "cancelUpdate");

        await userEvent.click(
            wrapper.find('[data-test="form-edit-close"]').element
        );

        expect(store.cancelUpdate).toBeCalledTimes(1);
    });

    it("Изменения в изображении сохраняются", async () => {
        const store = useImageEditStore();
        jest.spyOn(store, "updateImage");

        await userEvent.click(wrapper.find('[data-test="form-edit-save"]').element);

        expect(store.updateImage).toBeCalledTimes(1);
    });

    it("новый тег добавляется", async () => {
        const store = useImageEditStore();

        //Изначально в изменяемом изображении есть 2 тега
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //пользователь вводит тег и жмет Enter
        await wrapper.find('[data-test="input-tags"] input').setValue("test");
        wrapper
            .find<HTMLInputElement>('[data-test="input-tags"] input')
            .element.focus();
        await userEvent.keyboard("{Enter}");

        //новый тег должен добавиться, всего будет 3 тега
        expect(
            wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element
                .value
        ).toBe("");
        expect((store.image as ImageSingle).manifest.tags.length).toBe(3);
    });

    it("повторный тег не добавляется", async () => {
        const store = useImageEditStore();

        //Изначально в изменяемом изображении есть 2 тега
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //пользователь вводит уже существующий тег и жмет Enter
        await wrapper.find('[data-test="input-tags"] input').setValue("mock tag 1");
        wrapper
            .find<HTMLInputElement>('[data-test="input-tags"] input')
            .element.focus();
        await userEvent.keyboard("{Enter}");

        //этот тег не должен добавиться, так как он уже существует в этом изображении
        expect(
            wrapper.find<HTMLInputElement>('[data-test="input-tags"] input').element
                .value
        ).toBe("");
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);
    });

    it("тег удаляется при нажатии на него", async () => {
        const store = useImageEditStore();
        await wrapper.vm.$nextTick();

        //изначально в изменяемом изображении есть 2 тега
        expect((store.image as ImageSingle).manifest.tags.length).toBe(2);

        //пользователь жмет на первый тег
        await userEvent.click(wrapper.find('[data-test="tag-container"]').element);

        //этот тег удаляется, в изображении остается 1 тег
        expect((store.image as ImageSingle).manifest.tags.length).toBe(1);
    });

    it("Новое изображение вставляется", async () => {
        const store = useImageEditStore();
        const input = wrapper.find<HTMLInputElement>('[data-test="input-file"]');
        jest.spyOn(store, "changeImageFile");
        
        await wrapper.vm.$nextTick();
        await wrapper.vm.$forceUpdate();

        const fileUrl = wrapper.find<HTMLImageElement>(
            '[data-test="form-edit-image"] img'
        ).element.src;

        expect(fileUrl).not.toBe("");

        await userEvent.upload(input.element, new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }));

        expect(
            wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img')
                .element.src
        ).not.toBe(fileUrl);
        expect(store.changeImageFile).toBeCalledTimes(1);
    });

    it('новое видео вставляется', async () => {
        const input = wrapper.find<HTMLInputElement>('[data-test="input-file"]');

        //Изначально отображается изображение
        expect(wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img').element.src).toBeTruthy();
        expect(wrapper.find<HTMLVideoElement>('video').exists()).toBeFalsy();

        //Пользователь вставляет видео
        await userEvent.upload(input.element, new File(['(⌐□_□)'], 'chucknorris.mp4', { type: 'video/mp4' }));

        //Теперь вместо изображения отображается видео
        expect(wrapper.find<HTMLSourceElement>('source').element.src).toBeTruthy();
        expect(wrapper.find<HTMLImageElement>('img').exists()).toBeFalsy();
    });

    describe('работа с сетом', () => {
        let wrapper: VueWrapper<any>;
        let image: ImageSet;
        let collection: Collection;
        beforeEach(() => {
            image = new ImageSet({} as any, [] as any);
            image.arr[0].manifest.tags = ["1 tag", "2 tag", "3 tag"];
            image.arr[1].manifest.tags = ["11 tag", "12 tag", "13 tag"];
            collection = new Collection(jest.fn(), {} as any, {} as any)
            wrapper = mount(FormImageEdit, {
                global: {
                    plugins: [
                        createTestingPinia({
                            initialState: {
                                collections: {
                                    activeCollection: collection
                                },
                                imageEdit: {
                                    image,
                                },
                            },
                        }),
                    ],
                },
                attachTo: document.body,
            });
        });

        it("активное изображение менятся", async () => {
            await wrapper.vm.$nextTick();
            await wrapper.vm.$forceUpdate();

            let imgSrc = wrapper.find<HTMLImageElement>(
                '[data-test="form-edit-image"] img'
            ).element.src;

            let firstTag = wrapper
                .find<HTMLElement>('[data-test="tag-container"]')
                .text();

            //пользователь выбирает 2 изображение в списке изображений
            await userEvent.click(
                wrapper.findAll('[data-test="select-image-card"]')[1].element
            );

            //src нового изображения не должен быть равен src предыдущего изображения
            expect(
                wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img')
                    .element.src
            ).not.toBe(imgSrc);

            //теги нового изображения не должны быть равны тегам предыдущего изображения
            expect(
                wrapper.find<HTMLElement>('[data-test="tag-container"]').text()
            ).not.toBe(firstTag);

            imgSrc = wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img')
                .element.src;
            firstTag = wrapper.find<HTMLElement>('[data-test="tag-container"]').text();

            await userEvent.click(
                wrapper.findAll('[data-test="select-image-card"]')[0].element
            );

            expect(
                wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img')
                    .element.src
            ).not.toBe(imgSrc);
            expect(
                wrapper.find<HTMLElement>('[data-test="tag-container"]').text()
            ).not.toBe(firstTag);
        });

        it("активное изображение меняется, и меняются теги во всех изображениях", async () => {
            await wrapper.vm.$nextTick();
            //изначально активно первое изображение и в нем есть 3 тега.
            expect(
                wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length
            ).toBe(3);

            //добавляем новый тег.
            //в активном изображении теперь 4 тега.
            await wrapper.find('[data-test="input-tags"] input').setValue("test");
            wrapper.find<HTMLElement>('[data-test="input-tags"] input').element.focus();
            await userEvent.keyboard("{Enter}");
            expect(
                wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length
            ).toBe(4);

            //делаем активным второе изображение и удаляем из него 1 тег.
            //в активном изображении теперь 2 тега.
            await userEvent.click(
                wrapper.findAll('[data-test="select-image-card"]')[1].element
            );
            expect(
                wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length
            ).toBe(3);

            await userEvent.click(wrapper.find('[data-test="tag-container"]').element);
            expect(
                wrapper.findAll<HTMLElement>('[data-test="tag-container"]').length
            ).toBe(2);
        });

        it("изображения меняются местами", async () => {
            await wrapper.vm.$nextTick();
            const store = useImageEditStore();
            const firstImage = (store.image as ImageSet).arr[0];

            wrapper
                .findComponent(SelectImage)
                .vm.$emit("dragSort", { fromIndex: 1, toIndex: 0 });

            expect((store.image as ImageSet).arr[0]).not.toBe(firstImage);
        });

        it("отдельное изображение отделяется от сета", async () => {
            const store = useImageEditStore();
            await wrapper.vm.$nextTick();
            jest.spyOn(store, "separateImage");

            //жмем кнопку удаления изображения в сете
            await userEvent.click(
                wrapper.find('[data-test="form-edit-remove-image"]').element
            );
            expect(store.separateImage).toBeCalledTimes(1);
        });

        it("изображение рендерится", async () => {
            await wrapper.vm.$nextTick();
            await wrapper.vm.$forceUpdate();

            expect(
                wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img')
                    .element.src
            ).not.toBe("");
        });

        it("Изображение ререндерится при смене активного изображения", async () => {
            await wrapper.vm.$nextTick();
            await wrapper.vm.$forceUpdate();

            const firstImageSrc = wrapper.find<HTMLImageElement>(
                '[data-test="form-edit-image"] img'
            ).element.src;

            //Изначальное изображение получает src и рендерится
            expect(firstImageSrc).not.toBe("");

            //меняем активное изображение
            await userEvent.click(
                wrapper.findAll('[data-test="select-image-card"]')[1].element
            );

            //новое изображение рендерится, src нового изображения не равен src старого изображения
            expect(
                wrapper.find<HTMLImageElement>('[data-test="form-edit-image"] img')
                    .element.src
            ).not.toBe(firstImageSrc);
        });
    })
});
