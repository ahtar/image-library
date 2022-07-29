import { mount, VueWrapper } from "@vue/test-utils";
import { VueNode } from "@vue/test-utils/dist/types";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import FormCollectionCreate from "@/components/FormCollectionCreate.vue";
import InputImage from "@/components/InputImage.vue";
import ModalDark from "@/components/ModalDark.vue";

import { useCollectionCreateStore } from "@/store/forms/form-collection-create";

jest.mock("@/composables/clipboard");
jest.mock("@/composables/image-rendering");

globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();

describe("FormCollectionCreate.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(FormCollectionCreate, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("название коллекции вводится", () => {
        const store = useCollectionCreateStore();

        expect(store.form.name).toBe("");

        wrapper
            .find('[data-test="collection-create-name"] input')
            .setValue("collection name");

        expect(store.form.name).toBe("collection name");
    });

    it("тема коллекции вводится", () => {
        const store = useCollectionCreateStore();

        expect(store.form.theme).toBe("");

        wrapper
            .find('[data-test="collection-create-theme"] input')
            .setValue("collection theme");

        expect(store.form.theme).toBe("collection theme");
    });

    it("описание коллекции вводится", () => {
        const store = useCollectionCreateStore();

        expect(store.form.description).toBe("");

        wrapper
            .find('[data-test="collection-create-description"] textarea')
            .setValue("collection description");

        expect(store.form.description).toBe("collection description");
    });

    it("данные коллекции сбрасываются", async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, "clearForm");

        await userEvent.click(
            wrapper.find('[data-test="collection-create-clear"]').element
        );

        expect(store.clearForm).toBeCalledTimes(1);
    });

    it('коллекция сохраняется, если название введено и изображение вставленно', async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, "createCollection");

        store.form.blob = new Blob();
        wrapper
            .find('[data-test="collection-create-name"] input')
            .setValue("collection name");

        expect(store.form.blob).not.toBeFalsy();
        expect(store.form.name).toBe("collection name");

        await userEvent.click(
            wrapper.find('[data-test="collection-create-save"]').element
        );

        expect(store.createCollection).toBeCalledTimes(1);
    });

    it("форма закрывается, если нажать за границу окна", async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, "close");

        await userEvent.click(wrapper.findComponent(ModalDark).element);
        expect(store.close).toBeCalledTimes(1);
    });

    it("форма не закрывается, если нажать в пределах окна", async () => {
        const store = useCollectionCreateStore();
        jest.spyOn(store, "close");

        await userEvent.click(
            wrapper.find('[data-test="collection-create-wrapper"]').element
        );
        await userEvent.click(wrapper.findComponent(InputImage).element);
        expect(store.close).not.toBeCalled();
    });

    it("Настройка corrupted меняется", async () => {
        const store = useCollectionCreateStore();
        const checkbox = wrapper.find<HTMLInputElement>(
            '[data-test="collection-create-corrupted"] input'
        );

        expect(checkbox.element.checked).toBe(false);
        expect(store.form.options.corrupted).toBe(false);

        await userEvent.click(checkbox.element);
        await checkbox.trigger("change");

        expect(checkbox.element.checked).toBe(true);
        expect(store.form.options.corrupted).toBe(true);
    });

    describe('изображение вставляется', () => {
        let wrapper: VueWrapper<any> | null = null;
        let img: VueNode<HTMLImageElement> | null = null;
        let inputImage: VueNode<HTMLElement> | null = null;

        beforeEach(() => {
            wrapper = mount(FormCollectionCreate, {
                global: {
                    plugins: [createTestingPinia()],
                },
                attachTo: document.body,
            });

            img = wrapper.find<HTMLImageElement>("img").element;
            inputImage = wrapper!.find<HTMLElement>('[data-test="collection-create-image"]').element;
        })

        it("через paste event", async () => {
            const user = userEvent.setup();

            //src изображения это пустая строка, следовательно изображение не отрисовано
            expect(img!.src).toBe("");

            //пользователь жмет на элемент и вставляет изображение из буфера обмена
            await userEvent.click(inputImage!);
            await user.paste();

            //src изображения меняется с пустой строки, следовательно это изображение отрисовано
            expect(img!.src).not.toBe("");
        });

        it('через контекст меню', async () => {
            //src изображения это пустая строка, следовательно изображение не отрисовано
            expect(img!.src).toBe("");

            //вызов контекс меню
            await userEvent.pointer({ keys: '[MouseRight]', target: inputImage! });
            await userEvent.click(wrapper!.find<HTMLElement>('[data-test="input-image-context-paste"]').element);

            //src изображения меняется с пустой строки, следовательно это изображение отрисовано
            expect(img!.src).not.toBe("");
        });
    });

    describe('коллекция не сохраняется', () => {
        let wrapper: VueWrapper<any> | null = null;
        let saveButton: VueNode<Element> | null = null;

        beforeEach(() => {
            wrapper = mount(FormCollectionCreate, {
                global: {
                    plugins: [createTestingPinia()],
                },
            });

            saveButton = wrapper.find('[data-test="collection-create-save"]').element;
        });

        it("если название не введено и изображение не вставленно", async () => {
            const store = useCollectionCreateStore();
            jest.spyOn(store, "createCollection");

            expect(store.form.name).toBeFalsy();
            expect(store.form.blob).toBeFalsy();

            await userEvent.click(saveButton!);

            expect(store.createCollection).toBeCalledTimes(0);
        });

        it("если название введено и изображение не вставленно", async () => {
            const store = useCollectionCreateStore();
            jest.spyOn(store, "createCollection");

            wrapper!
                .find('[data-test="collection-create-name"] input')
                .setValue("collection name");

            expect(store.form.blob).toBeFalsy();
            expect(store.form.name).toBe("collection name");

            await userEvent.click(saveButton!);

            expect(store.createCollection).toBeCalledTimes(0);
        });

        it('если название не введено и изображение вставленно', async () => {
            const store = useCollectionCreateStore();
            jest.spyOn(store, "createCollection");

            store.form.blob = new Blob();

            expect(store.form.blob).not.toBeFalsy();
            expect(store.form.name).toBeFalsy();

            await userEvent.click(saveButton!);

            expect(store.createCollection).toBeCalledTimes(0);
        });
    });
});
