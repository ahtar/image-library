import { mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import InputImage from '@/components/InputImage.vue'

jest.mock('@/composables/clipboard');
jest.mock('@/modules/jimp.ts');
jest.mock('@/composables/image-rendering');

globalThis.URL.createObjectURL = jest.fn();
globalThis.URL.revokeObjectURL = jest.fn();

describe('InputImage.vue', () => {
    it('изображение вставляется', async () => {
        const wrapper = mount(InputImage, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            props: {
                active: true
            },
            attachTo: document.body
        });
        const user = userEvent.setup();

        await user.click(wrapper.element);
        await user.paste();

        expect(wrapper.emitted().paste).toBeDefined();
    });

    it('Изображение рендерится', () => {
        const wrapper = mount(InputImage, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            props: {
                blob: new Blob()
            }
        });

        expect(wrapper.find<HTMLImageElement>('img').element.src).not.toBe('');
    });

    it('компонент ожидает вставку изображения, если оно не вставлено', async () => {
        const wrapper = mount(InputImage, {
            global: {
                plugins: [createTestingPinia({
                })],
            },
            attachTo: document.body
        });

        //Никакое изображение не отображенно, ожидается вставка изображения
        expect(wrapper.html()).toContain('Вставь картинку');
        expect(wrapper.find<HTMLImageElement>('img').element.src).toBe('');


        await wrapper.setProps({blob: new Blob()});

        //Изображение отображенно, новое изображение не ожидается
        expect(wrapper.html()).not.toContain('Вставь картинку');
    });
});