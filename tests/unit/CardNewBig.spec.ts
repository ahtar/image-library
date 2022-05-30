import { shallowMount, mount } from "@vue/test-utils";

import CardNewBig from '@/components/CardNewBig.vue'


describe('CardNewBig.vue', () => {
    it('Рендерится', () => {
        const wrapper = mount(CardNewBig);

        expect(wrapper.exists()).toBe(true);
    });
});