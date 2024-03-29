import { mount, VueWrapper } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import MessagePrompt from '@/components/MessagePrompt.vue';
import ModalDark from '@/components/ModalDark.vue';
import { usePromptStore } from '@/store/modals/modal-prompt';

describe('MessagePrompt.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(MessagePrompt, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            prompt: {
                                message: 'test message',
                            },
                        },
                    }),
                ],
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[data-test="message-prompt"]').exists()).toBe(
            true
        );
    });

    it('сообщение оповещения отображается', () => {
        expect(wrapper.html()).toContain('test message');
    });

    it('оповещение можно подтвердить', async () => {
        const store = usePromptStore();
        jest.spyOn(store, 'confirm');

        await userEvent.click(wrapper.findAll('button')[1].element);

        expect(store.confirm).toBeCalledTimes(1);
    });

    it('оповещение можно отклонить', async () => {
        const store = usePromptStore();
        jest.spyOn(store, 'close');

        await userEvent.click(wrapper.findAll('button')[0].element);

        expect(store.close).toBeCalledTimes(1);
    });

    it('окно закрывается', async () => {
        const store = usePromptStore();
        jest.spyOn(store, 'close');

        await userEvent.click(wrapper.findComponent(ModalDark).element);

        expect(store.close).toBeCalledTimes(1);
    });
});
