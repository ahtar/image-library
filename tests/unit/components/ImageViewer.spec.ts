import { mount, VueWrapper } from '@vue/test-utils';
import ImageViewer from '@/components/ImageViewer.vue';

import ImageSingle from '@/classes/ImageSingle';
jest.mock('@/classes/ImageSingle');

describe('ImageViewer.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(ImageViewer, {
            props: {
                image: new ImageSingle({} as any, {} as any),
            },
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('отображает ImageSingle', () => {
        expect(wrapper.find<HTMLImageElement>('img').element.src).toBeTruthy();
    });
});
