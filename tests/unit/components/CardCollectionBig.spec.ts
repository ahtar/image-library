import { mount } from "@vue/test-utils";

import CardCollectionBig from '@/components/cardCollectionBig.vue'

jest.mock('@/composables/image-rendering');

describe('cardCollectionBig.vue', () => {
    it('рендерит изображение из props.fileHandle', () => {
        const wrapper = mount(CardCollectionBig, {
            props: {
                fileHandle: {}
            }
        });

        expect(wrapper.find<HTMLImageElement>('img').element.src).not.toBe('');
    });
});