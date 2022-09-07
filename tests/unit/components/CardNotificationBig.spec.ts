import { mount, VueWrapper } from "@vue/test-utils";

import CardNotificationBig from "@/components/CardNotificationBig.vue";

describe("CardNotificationBig.vue", () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(CardNotificationBig, {
            props: {
                message: "Hello World",
            },
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('[data-test="card-notification-big"]').exists()).toBe(true);
    });

    it("рендерит текст, полученный из  props.message", () => {
        expect(wrapper.html()).toContain("Hello World");
    });

    it("негативное оповещение при props.status == false", async () => {
        await wrapper.setProps({status: false});
        expect(wrapper.find(".success").exists()).toBe(false);
        expect(wrapper.find(".error").exists()).toBe(true);
    });

    it("положительное оповещение при props.status == false", async () => {
        await wrapper.setProps({status: true});
        expect(wrapper.find(".success").exists()).toBe(true);
        expect(wrapper.find(".error").exists()).toBe(false);
    });
});
