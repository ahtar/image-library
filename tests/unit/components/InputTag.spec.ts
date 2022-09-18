import { mount, VueWrapper } from '@vue/test-utils';
import userEvent from '@testing-library/user-event';
import { createTestingPinia } from '@pinia/testing';

import InputTag from '@/components/InputTag.vue';

describe('InputTag.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(InputTag, {
            global: {
                plugins: [createTestingPinia({})],
            },
            props: {
                tags: ['tag 1', 'tag 2', 'tag 3'],
            },
            attachTo: document.body,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('рендерится', () => {
        expect(wrapper.find('[class="tag-input-wrapper"]').exists()).toBe(true);
    });

    it('теги отображаются', async () => {
        for (const tag of wrapper.props().tags) {
            expect(wrapper.html()).toContain(tag);
        }
    });

    it('новый тег добавляется', async () => {
        await wrapper.find('input').setValue('tag 4');
        wrapper.find('input').element.focus();

        await userEvent.keyboard('{Enter}');

        expect(wrapper.emitted().add).toBeDefined();
    });

    it('новый тег не добавляется, если он уже существует', async () => {
        await wrapper.find('input').setValue('tag 3');
        wrapper.find('input').element.focus();

        await userEvent.keyboard('{Enter}');

        expect(wrapper.emitted().add).not.toBeDefined();
    });

    it('существующие теги предлагаются', async () => {
        await wrapper.setProps({
            definedTags: [
                {
                    name: 'tag 4',
                    count: 10,
                },
            ],
        });

        await wrapper.find('input').setValue('tag 4');

        expect(wrapper.html()).toContain('tag 4 (10)');
    });

    it('предложенный тег добавляется кликом', async () => {
        await wrapper.setProps({
            definedTags: [
                {
                    name: 'tag 4',
                    count: 10,
                },
            ],
        });

        wrapper.find('input').element.focus();
        await wrapper.find('input').setValue('tag 4');

        await userEvent.click(
            wrapper.findAll<HTMLElement>(
                '[data-test="input-tag-suggestion"]'
            )[0].element
        );

        expect(wrapper.emitted().add).toBeDefined();
    });

    it('автозаполнение работает', async () => {
        await wrapper.setProps({
            definedTags: [
                {
                    name: 'tag 4',
                    count: 10,
                },
            ],
        });

        wrapper.find('input').element.focus();
        await wrapper.find('input').setValue('tag');

        await userEvent.keyboard('{ArrowDown}');

        expect(wrapper.find<HTMLInputElement>('input').element.value).toBe(
            'tag 4'
        );
    });

    it('тег удаляется', async () => {
        await userEvent.click(
            wrapper.find('[data-test="tag-container"]').element
        );

        expect(wrapper.emitted().remove).toBeDefined();
    });
});
