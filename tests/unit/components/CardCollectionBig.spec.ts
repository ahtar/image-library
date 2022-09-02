import { mount, VueWrapper } from "@vue/test-utils";

import CardCollectionBig from "@/components/cardCollectionBig.vue";

jest.mock("@/composables/image-rendering");

describe("cardCollectionBig.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(CardCollectionBig, {
            props: {
                fileHandle: {},
            },
        });
    });
    
    it('рендерится', () => {
        expect(wrapper.find('[data-test="collection-card-big"]').exists()).toBe(true);
    });

    it("рендерит изображение из props.fileHandle", () => {
        expect(wrapper.find<HTMLImageElement>("img").element.src).toBeTruthy();
    });
});
