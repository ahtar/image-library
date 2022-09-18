import { mount, VueWrapper } from '@vue/test-utils';
import VideoPlayer from '@/components/VideoPlayer.vue';

import ImageSingle from '@/classes/ImageSingle';
jest.mock('@/classes/ImageSingle');

describe('VideoPlayer.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(VideoPlayer, {
            props: {},
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('video').exists()).toBe(true);
        expect(wrapper.find('source').exists()).toBe(true);
    });

    it('ничего не отображает, если props.data == null или undefined', async () => {
        const source = wrapper.find<HTMLSourceElement>('source').element;

        //props.data == undefined
        //source.src не указан
        expect(source.src).toBeFalsy();

        await wrapper.setProps({
            data: null,
        });

        //props.data == null
        //source.src всё ещё не указан
        expect(source.src).toBeFalsy();
    });

    it('отображает File', async () => {
        const source = wrapper.find<HTMLSourceElement>('source').element;

        //source.src не указан
        expect(source.src).toBeFalsy();

        await wrapper.setProps({
            data: new File(['(⌐□_□)'], 'chucknorris.mp4', {
                type: 'video/mp4',
            }),
        });

        //source.src указан
        expect(source.src).not.toBeFalsy();
    });

    it('отображает ImageSingle', async () => {
        const source = wrapper.find<HTMLSourceElement>('source').element;

        //source.src не указан
        expect(source.src).toBeFalsy();

        await wrapper.setProps({
            data: new ImageSingle({} as any, {} as any),
        });
        await wrapper.vm.$nextTick();

        //source.src указан
        expect(source.src).not.toBeFalsy();
    });

    it('отображает FileSystemFileHandle', async () => {
        const source = wrapper.find<HTMLSourceElement>('source').element;
        const image = new ImageSingle({} as any, {} as any);

        //source.src не указан
        expect(source.src).toBeFalsy();

        await wrapper.setProps({
            data: await image.getImage(),
        });
        await wrapper.vm.$nextTick();

        //source.src указан
        expect(source.src).not.toBeFalsy();
    });
});
