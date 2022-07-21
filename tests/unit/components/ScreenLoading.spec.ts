import { mount, shallowMount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import ScreenLoading from "@/components/ScreenLoading.vue";
import Spinner from "@/components/Spinner.vue";

describe("ScreenLoading.vue", () => {
    it("рендерится", () => {
        const wrapper = mount(ScreenLoading, {
            global: {
                plugins: [createTestingPinia({})],
            },
        });

        expect(wrapper.findComponent(Spinner)).toBeDefined();
    });
});
