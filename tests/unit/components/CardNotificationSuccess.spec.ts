import { mount, VueWrapper } from '@vue/test-utils';

import CardNotificationSuccess from '@/components/CardNotificationSuccess.vue';

describe('CardNotificationSuccess.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(CardNotificationSuccess, {
            props: {
                message: 'Hello World',
            },
        });
    });

    it('рендерится', () => {
        expect(
            wrapper.find('[data-test="card-notification-success"]').exists()
        ).toBe(true);
    });

    it('рендерит текст, полученный из  props.message', () => {
        expect(wrapper.html()).toContain('Hello World');
    });

    it('событие Close при нажатии', async () => {
        await wrapper.trigger('click');
        expect(wrapper.emitted().close).toBeDefined();
    });
});
