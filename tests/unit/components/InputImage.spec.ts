import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import InputImage from "@/components/InputImage.vue";

jest.mock("@/composables/clipboard");
jest.mock("@/modules/jimp.ts");
jest.mock("@/composables/image-rendering");

globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();

describe("InputImage.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(InputImage, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                active: true,
            },
            attachTo: document.body,
        });
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("изображение вставляется", () => {
        it("через paste event", async () => {
            const user = userEvent.setup();

            await user.click(wrapper.element);
            await user.paste();

            expect(wrapper.emitted().paste).toBeDefined();
        });

        it("через контекс меню", async () => {
            //вызов контекс меню
            await userEvent.pointer({ keys: '[MouseRight]', target: wrapper.element });
            await userEvent.click(wrapper.find<HTMLElement>('[data-test="input-image-context-paste"]').element);

            expect(wrapper.emitted().paste).toBeDefined();
        });
    });

    it("Изображение рендерится", async () => {
        await wrapper.setProps({ blob: new Blob() });
        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe("");
    });

    it("компонент ожидает вставку изображения, если оно не вставлено", async () => {
        //Никакое изображение не отображенно, ожидается вставка изображения
        expect(wrapper.html()).toContain("INPUT_IMAGE.MESSAGE");
        expect(wrapper.find<HTMLImageElement>("img").element.src).toBe("");

        await wrapper.setProps({ blob: new Blob() });

        //Изображение отображенно, вставка изображения не ожидается
        expect(wrapper.html()).not.toContain("INPUT_IMAGE.MESSAGE");
    });
});
