import { mount } from "@vue/test-utils";

import CardNotificationError from '@/components/CardNotificationError.vue'


describe('CardNotificationError.vue', () => {
    it('рендерит текст, полученный из  props.message', () => {
        const msg = 'Hello World';
        const wrapper = mount(CardNotificationError, {
            props: {
                message: msg
            }
        });

        expect(wrapper.find('.message').text()).toMatch(msg);
    });

    it('emit Close при нажатии', async () => {
        const msg = 'Hello World';
        const wrapper = mount(CardNotificationError, {
            props: {
                message: msg
            }
        });

        await wrapper.trigger('click');

        expect(wrapper.emitted().close).toBeTruthy();
    });
});