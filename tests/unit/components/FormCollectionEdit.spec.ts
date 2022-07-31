import { DOMWrapper, mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import FormCollectionEdit from "@/components/FormCollectionEdit.vue";
import { useCollectionEditStore } from "@/store/forms/form-collection-edit";
import { usePromptStore } from "@/store/modals/modal-prompt";

import Collection from "@/classes/Collection";

jest.mock("@/classes/Collection");
jest.mock("@/composables/clipboard");
jest.mock("@/modules/jimp.ts");
jest.mock("@/composables/image-rendering");

globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();

describe("FormCollectionEdit", () => {

    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            collectionEdit: {
                                visible: true,
                                form: {
                                    name: "mock name",
                                    theme: "mock theme",
                                    description: "mock description",
                                    file: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
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

    it("форма закрывается", async () => {
        const store = useCollectionEditStore();
        jest.spyOn(store, "close");
        await wrapper.vm.$nextTick();

        await userEvent.click(wrapper.find('[data-test="modal"]').element);

        expect(store.close).toBeCalledTimes(1);
    });

    it("название вводится", async () => {
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.name).toBe("mock name");
        await wrapper
            .find<HTMLInputElement>('[data-test="collection-edit-name"] input')
            .setValue("new name");
        expect(store.form.name).toBe("new name");
    });

    it("тема вводится", async () => {
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.theme).toBe("mock theme");
        await wrapper
            .find<HTMLInputElement>('[data-test="collection-edit-theme"] input')
            .setValue("new theme");
        expect(store.form.theme).toBe("new theme");
    });

    it("описание вводится", async () => {
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.description).toBe("mock description");
        await wrapper
            .find<HTMLInputElement>(
                '[data-test="collection-edit-description"] textarea'
            )
            .setValue("new description");
        expect(store.form.description).toBe("new description");
    });

    it("изображение меняется", async () => {
        await wrapper.vm.$nextTick();

        const imgSrc = wrapper.find<HTMLImageElement>("img").element.src;
        const input = wrapper.find<HTMLInputElement>('[data-test="input-file"]');

        expect(imgSrc).not.toBe("");

        await userEvent.upload(input.element, new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }));

        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe("");
        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe(imgSrc);
    });

    it("изменения в коллекции сохраняются", async () => {
        const store = useCollectionEditStore();
        jest.spyOn(store, "save");
        await wrapper.vm.$nextTick();

        await userEvent.click(wrapper.find<HTMLButtonElement>("button").element);
        expect(store.save).toBeCalledTimes(1);
    });

    it("изменения в коллекции не сохраняются, если название коллекции не введено", async () => {
        const store = useCollectionEditStore();
        jest.spyOn(store, "save");
        await wrapper.vm.$nextTick();

        await wrapper
            .find<HTMLInputElement>('[data-test="collection-edit-name"] input')
            .setValue("");
        await userEvent.click(wrapper.find<HTMLButtonElement>("button").element);
        expect(store.save).toBeCalledTimes(0);
    });

    it("Настройка corrupted меняется", async () => {
        const store = useCollectionEditStore();
        const checkbox = wrapper.find<HTMLInputElement>(
            '[data-test="collection-edit-corrupted"] input'
        );

        expect(checkbox.element.checked).toBe(false);
        expect(store.form.options.corrupted).toBe(false);

        await userEvent.click(checkbox.element);
        await checkbox.trigger("change");

        expect(checkbox.element.checked).toBe(true);
        expect(store.form.options.corrupted).toBe(true);
    });

    describe('Запрос об изменении изображений', () => {
        let wrapper: VueWrapper<any>;
        let collection: Collection;
        let checkbox: DOMWrapper<HTMLInputElement>;
        let saveButton: DOMWrapper<HTMLElement>;

        beforeEach(() => {
            wrapper = mount(FormCollectionEdit, {
                global: {
                    plugins: [
                        createTestingPinia({
                            stubActions: false,
                        }),
                    ],
                },
            });

            collection = new Collection({} as any, {} as any, {} as any);

            checkbox = wrapper.find<HTMLInputElement>(
                '[data-test="collection-edit-corrupted"] input'
            );
            saveButton = wrapper.find<HTMLElement>(
                '[data-test="collection-edit-save"]'
            );
        });

        it("У пользователя не спрашивают, нужно ли менять существующие изображения, если  параметр corrupted не был изменен", async () => {
            const store = useCollectionEditStore();
            const storePrompt = usePromptStore();

            //Инициализация.
            store.open(collection);
    
            //Окно prompt не показано.
            expect(storePrompt.visible).toBe(false);
    
            //Сохранение коллекции.
            await userEvent.click(saveButton.element);
    
            //Окно prompt всё ещё показано.
            expect(storePrompt.visible).toBe(false);
        });
    
        it("У пользователя спрашивают, нужно ли менять существующие изображения, если  параметр corrupted был изменен", async () => {
            const store = useCollectionEditStore();
            const storePrompt = usePromptStore();
    
            //Инициализация.
            store.open(collection);
    
            //Окно prompt не показано.
            expect(storePrompt.visible).toBe(false);
    
            //Изменение corrupted.
            await userEvent.click(checkbox.element);
            await checkbox.trigger("change");
    
            //Сохранение коллекции.
            await userEvent.click(saveButton.element);
    
            //Окно prompt показано.
            expect(storePrompt.visible).toBe(true);
            expect(storePrompt.message).toBe('PROMPT.COLL_CORR_CONVERT_IMAGES');
        });
    })
});
