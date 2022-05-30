import { mount } from "@vue/test-utils";

import CardNotificationSuccess from '@/components/CardNotificationSuccess.vue'


describe('CardNotificationSuccess.vue', () => {
    it('рендерит текст, полученный из  props.message', () => {
        const msg = 'Hello World';
        const wrapper = mount(CardNotificationSuccess, {
            props: {
                message: msg
            }
        });

        expect(wrapper.find('.message').text()).toMatch(msg);
    });

    it('emit Close при нажатии', async () => {
        const msg = 'Hello World';
        const wrapper = mount(CardNotificationSuccess, {
            props: {
                message: msg
            }
        });

        await wrapper.trigger('click');

        expect(wrapper.emitted().close).toBeTruthy();
    });
});