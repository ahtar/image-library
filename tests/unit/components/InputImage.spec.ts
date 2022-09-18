import { mount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';

import InputImage from '@/components/InputImage.vue';

jest.mock('@/composables/clipboard');
jest.mock('@/modules/jimp.ts');
jest.mock('@/composables/image-rendering');

describe('InputImage.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(InputImage, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                active: true,
            },
            attachTo: document.body,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[class="input-image"]').exists()).toBe(true);
    });

    describe('accept', () => {
        it('изначально принимает и изображения, и видео', () => {
            expect(wrapper.find<HTMLInputElement>('input').element.accept).toBe(
                'image/*,video/*'
            );
        });

        it('при props.acceptImage = false, не принимает изображения', async () => {
            await wrapper.setProps({
                acceptImage: false,
            });

            expect(wrapper.find<HTMLInputElement>('input').element.accept).toBe(
                'video/*'
            );
        });

        it('при props.acceptVideo = false, не принимает видео', async () => {
            await wrapper.setProps({
                acceptVideo: false,
            });

            expect(wrapper.find<HTMLInputElement>('input').element.accept).toBe(
                'image/*'
            );
        });
    });

    it('Файл вставляется', async () => {
        const input = wrapper.find<HTMLInputElement>(
            '[data-test="input-file"]'
        );

        await userEvent.upload(
            input.element,
            new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
        );

        expect(wrapper.emitted().paste).toBeDefined();
    });

    it('Файл рендерится', async () => {
        await wrapper.setProps({
            fileData: new File([new Blob()], 'programmatically_created.png'),
        });
        expect(wrapper.find<HTMLImageElement>('img').element.src).not.toBe('');
    });

    it('компонент ожидает файл', async () => {
        expect(wrapper.html()).toContain('BUTTON.INPUT_FILE');
    });
});
