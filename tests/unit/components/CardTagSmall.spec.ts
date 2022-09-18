import { mount, VueWrapper } from '@vue/test-utils';

import CardTagSmall from '@/components/CardTagSmall.vue';

describe('CardTagSmall.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(CardTagSmall, {
            props: {
                tag: {
                    name: 'test',
                    count: 50,
                },
            },
        });
    });

    it('рендерится', () => {
        expect(wrapper.find('[data-test="card-tag-small"]').exists()).toBe(
            true
        );
    });

    it('рендерит полученный props.tag', () => {
        expect(wrapper.html()).toContain('test (50)');
    });
});
