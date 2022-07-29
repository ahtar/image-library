import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import ModalDark from "@/components/ModalDark.vue";

describe("ModalDark.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ModalDark, {
            global: {
                plugins: [createTestingPinia({})],
            },
            slots: {
                default: "<div>test content</div>",
            },
        });
    });
    
    it("slot рендерится", () => {
        expect(wrapper.html()).toContain("test content");
    });

    it("закрывается", async () => {
        await userEvent.click(wrapper.element);

        expect(wrapper.emitted().close).toBeDefined();
    });
});
