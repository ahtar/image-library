import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import FormImageView from "@/components/FormImageView.vue";
import { useImageViewStore } from "@/store/forms/form-image-view";
import ImageSet from "@/classes/ImageSet";

jest.mock("@/classes/Collection");
jest.mock("@/classes/ImageSet");
jest.mock("@/classes/ImageSingle");
jest.mock("@/composables/image-rendering");

describe("FormImageView.vue", () => {

    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(FormImageView, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            imageView: {
                                image: new ImageSet({} as any, {} as any),
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
        expect(wrapper.find('[data-test="form-view-close"]').exists()).toBe(true);
    });

    it("форма закрывается, если нажать за границу окна", async () => {
        const store = useImageViewStore();
        jest.spyOn(store, "close");

        await userEvent.click(
            wrapper.find('[data-test="form-view-close"]').element
        );

        expect(store.close).toBeCalledTimes(1);
    });

    it("изображение рендерится", async () => {
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find<HTMLImageElement>('[data-test="form-view-viewer"] img')
                .element.src
        ).not.toBe("");
    });

    it("активное изображение меняется", async () => {
        await wrapper.vm.$nextTick();

        //изначально отрисованное изображение
        const firstSrc = wrapper.find<HTMLImageElement>(
            '[data-test="form-view-viewer"] img'
        ).element.src;

        expect(firstSrc).not.toBe("");

        //нажимаем на 2 изображение в сете
        await userEvent.click(
            wrapper.find('[data-test="form-view-select"]').element.children[1]
        );

        //img.src должен измениться на новое изображение
        expect(
            wrapper.find<HTMLImageElement>('[data-test="form-view-viewer"] img')
                .element.src
        ).not.toBe("");
        expect(
            wrapper.find<HTMLImageElement>('[data-test="form-view-viewer"] img')
                .element.src
        ).not.toBe(firstSrc);
    });
});
