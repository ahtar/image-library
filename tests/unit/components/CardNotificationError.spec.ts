import { mount, VueWrapper } from "@vue/test-utils";

import CardNotificationError from "@/components/CardNotificationError.vue";

describe("CardNotificationError.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(CardNotificationError, {
            props: {
                message: "Hello World",
            },
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('[class="wrapper"]').exists()).toBe(true);
    });

    it("рендерит текст, полученный из  props.message", () => {
        expect(wrapper.html()).toContain("Hello World");
    });

    it("событие Close при нажатии", async () => {
        await wrapper.trigger("click");
        expect(wrapper.emitted().close).toBeDefined();
    });
});
