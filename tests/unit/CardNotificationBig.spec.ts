import { shallowMount, mount } from "@vue/test-utils";

import CardNotificationBig from '@/components/CardNotificationBig.vue'


describe('CardNotificationBig.vue', () => {
    it('рендерит текст, полученный из  props.message', () => {
        const msg = 'Hello World';
        const wrapper = mount(CardNotificationBig, {
            props: {
                message: msg
            }
        });

        expect(wrapper.find('.notification').text()).toMatch(msg);
    });

    it('рендерится в зависимости от props.status', () => {
        const msg = 'Hello World';
        const wrapper = mount(CardNotificationBig, {
            props: {
                message: msg,
                status: false
            }
        });

        expect(wrapper.find('.success').exists()).toBe(false);
        expect(wrapper.find('.error').exists()).toBe(true);
    });
});