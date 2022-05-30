import { shallowMount, mount } from "@vue/test-utils";
import userEvent from '@testing-library/user-event';

import CardCollectionBig from '@/components/cardCollectionBig.vue'

describe('cardCollectionBig.vue', () => {
    it('рендерит изображение из полученного props.fileHandle', () => {
        const fakeFile = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });

        /*globalThis.URL.createObjectURL = jest.fn().mockImplementation(() => 'fileObjectUrl');
        
        const wrapper = mount(CardCollectionBig, {
            props: { fileHandle: URL.createObjectURL(fakeFile) }
        });*/

        //wrapper.vm.$refs
        //console.log('IMAGE SOURCE');
        //console.log(wrapper.vm.$refs.imgRef);
    });
});