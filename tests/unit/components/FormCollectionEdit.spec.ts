import { mount } from "@vue/test-utils";
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
    it("форма закрывается", async () => {
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
        });
        const store = useCollectionEditStore();
        jest.spyOn(store, "close");
        await wrapper.vm.$nextTick();

        await userEvent.click(wrapper.find('[data-test="modal"]').element);

        expect(store.close).toBeCalledTimes(1);
    });

    it("название вводится", async () => {
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
        });
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.name).toBe("mock name");
        await wrapper
            .find<HTMLInputElement>('[data-test="collection-edit-name"] input')
            .setValue("new name");
        expect(store.form.name).toBe("new name");
    });

    it("тема вводится", async () => {
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
        });
        const store = useCollectionEditStore();
        await wrapper.vm.$nextTick();

        expect(store.form.theme).toBe("mock theme");
        await wrapper
            .find<HTMLInputElement>('[data-test="collection-edit-theme"] input')
            .setValue("new theme");
        expect(store.form.theme).toBe("new theme");
    });

    it("описание вводится", async () => {
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
        });
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
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
            attachTo: document.body,
        });
        const store = useCollectionEditStore();
        const user = userEvent.setup();
        await wrapper.vm.$nextTick();

        const imgSrc = wrapper.find<HTMLImageElement>("img").element.src;

        expect(imgSrc).not.toBe("");

        await userEvent.click(
            wrapper.find<HTMLElement>('[data-test="collection-edit-image"]').element
        );
        await user.paste();

        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe("");
        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe(imgSrc);
    });

    it("изменения в коллекции сохраняются", async () => {
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
            attachTo: document.body,
        });
        const store = useCollectionEditStore();
        jest.spyOn(store, "save");
        await wrapper.vm.$nextTick();

        await userEvent.click(wrapper.find<HTMLButtonElement>("button").element);
        expect(store.save).toBeCalledTimes(1);
    });

    it("изменения в коллекции не сохраняются, если название коллекции не введено", async () => {
        const wrapper = mount(FormCollectionEdit, {
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
                                    blob: new Blob(),
                                },
                                collection: new Collection(jest.fn(), {} as any, {} as any),
                            },
                        },
                    }),
                ],
            },
            attachTo: document.body,
        });
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
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
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

    it("У пользователя не спрашивают, нужно ли менять существующие изображения, если  параметр corrupted не был изменен", async () => {
        const collection = new Collection({} as any, {} as any, {} as any);
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                    }),
                ],
            },
        });
        const store = useCollectionEditStore();
        const storeNotification = usePromptStore();
        const saveButton = wrapper.find<HTMLElement>(
            '[data-test="collection-edit-save"]'
        );

        //Инициализация.
        store.open(collection);

        //Окно prompt не показано.
        expect(storeNotification.visible).toBe(false);

        //Сохранение коллекции.
        await userEvent.click(saveButton.element);

        //Окно prompt всё ещё показано.
        expect(storeNotification.visible).toBe(false);
    });

    it("У пользователя спрашивают, нужно ли менять существующие изображения, если  параметр corrupted был изменен", async () => {
        const collection = new Collection({} as any, {} as any, {} as any);
        const wrapper = mount(FormCollectionEdit, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                    }),
                ],
            },
        });
        const store = useCollectionEditStore();
        const storeNotification = usePromptStore();
        const checkbox = wrapper.find<HTMLInputElement>(
            '[data-test="collection-edit-corrupted"] input'
        );
        const saveButton = wrapper.find<HTMLElement>(
            '[data-test="collection-edit-save"]'
        );

        //Инициализация.
        store.open(collection);

        //Окно prompt не показано.
        expect(storeNotification.visible).toBe(false);

        //Изменение corrupted.
        await userEvent.click(checkbox.element);
        await checkbox.trigger("change");

        //Сохранение коллекции.
        await userEvent.click(saveButton.element);

        //Окно prompt показано.
        expect(storeNotification.visible).toBe(true);
    });
});
