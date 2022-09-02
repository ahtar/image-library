import { mount, VueWrapper } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import MenuConfirmOverlay from "@/components/MenuConfirmOverlay.vue";

describe("MenuConfirmOverlay.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(MenuConfirmOverlay, {
            global: {
                plugins: [createTestingPinia({})],
            },
        });
    });

    it("рендерится", () => {
        expect(wrapper.html()).toContain("BUTTON.CONFIRM");
        expect(wrapper.html()).toContain("BUTTON.CANCEL");
    });

    it("событие save отправляется при подтверждении", async () => {
        await userEvent.click(wrapper.element.children[1]);

        expect(wrapper.emitted().save).toBeDefined();
    });

    it("событие cancel отправляется при отрицании", async () => {
        await userEvent.click(wrapper.element.children[0]);

        expect(wrapper.emitted().cancel).toBeDefined();
    });
});
