import { mount, VueWrapper } from "@vue/test-utils";

import CardImageSmall from "@/components/CardImageSmall.vue";
import ImageSingle from "@/classes/ImageSingle";
import ImageSet from "@/classes/ImageSet";

jest.mock("@/composables/image-rendering");
jest.mock("@/classes/ImageSingle.ts");
jest.mock("@/classes/ImageSet.ts");

describe("CardImageSmall.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(CardImageSmall, {
            props: {
                image: new ImageSingle({} as any, {} as any),
            }
        });
    })

    it("изображение рендерится", async () => {
        expect(wrapper.find<HTMLImageElement>("img").element.src).not.toBe("");
    });

    it("Если изображение не сет, то знак сета не показан", () => {
        expect(
            wrapper.find('[data-test="card-image-small-set"]').exists()
        ).toBeFalsy();
    });

    it("Если изображение сет, то знак сета показан", async () => {
        await wrapper.setProps({ image: new ImageSet({} as any, {} as any) });

        expect(
            wrapper.find('[data-test="card-image-small-set"]').exists()
        ).toBeTruthy();
    });
});
