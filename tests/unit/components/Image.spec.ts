import { mount, VueWrapper } from '@vue/test-utils';

import Image from '@/components/Image.vue';

import ImageSingle from '@/classes/ImageSingle';
jest.mock('@/classes/ImageSingle');

describe('Image.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Image, {
            props: {},
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('img').exists()).toBe(true);
    });

    it('ничего не показывает при props.data == undefined', () => {
        expect(wrapper.find<HTMLImageElement>('img').element.src).toBeFalsy();
    });

    it('рендерит Blob', async () => {
        const img = wrapper.find<HTMLImageElement>('img').element;

        expect(img.src).toBeFalsy();

        await wrapper.setProps({
            data: new Blob(),
        });

        expect(img.src).not.toBeFalsy();
    });

    it('рендерит File', async () => {
        const img = wrapper.find<HTMLImageElement>('img').element;

        expect(img.src).toBeFalsy();

        await wrapper.setProps({
            data: new File(['(⌐□_□)'], 'chucknorris.png', {
                type: 'image/png',
            }),
        });

        expect(img.src).not.toBeFalsy();
    });

    it('рендерит FileSystemFileHandle', async () => {
        const img = wrapper.find<HTMLImageElement>('img').element;
        const image = new ImageSingle({} as any, {} as any);

        expect(img.src).toBeFalsy();

        await wrapper.setProps({
            data: await image.getImage(),
        });

        expect(img.src).not.toBeFalsy();
    });
});
