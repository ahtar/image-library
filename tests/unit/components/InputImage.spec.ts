import { mount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import userEvent from "@testing-library/user-event";

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

    it("Файл вставляется", async () => {
        const input = wrapper.find<HTMLInputElement>('[data-test="input-file"]');

        await userEvent.upload(input.element, new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }));

        expect(wrapper.emitted().paste).toBeDefined();
    });

    it("Файл рендерится", async () => {
        await wrapper.setProps({ fileData: new File([new Blob()], 'programmatically_created.png') });
        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe("");
    });

    it("компонент ожидает файл", async () => {
        expect(wrapper.html()).toContain("Choose a file...");
    });
});
