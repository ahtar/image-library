import { mount } from "@vue/test-utils";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import MessageNotification from "@/components/MessageNotification.vue";
import { useNotificationStore } from "@/store/modals/modal-notification";

describe("MessageNotification.vue", () => {
    it("Оповещения рендерятся", async () => {
        const wrapper = mount(MessageNotification, {
            global: {
                plugins: [createTestingPinia({})],
            },
        });
        const store = useNotificationStore();

        //изначально никаких оповещений нет
        expect(wrapper.text()).toBe("");

        //показываем новое оповещение
        store.activeNotifications.push({
            message: "test notification",
            status: true,
            id: 0,
        });
        await wrapper.vm.$nextTick();

        //оповещение должно отобразиться
        expect(wrapper.text()).toContain("test notification");
    });

    it("Оповещения закрываются", async () => {
        const wrapper = mount(MessageNotification, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                    }),
                ],
            },
        });
        const store = useNotificationStore();

        //показываем новое оповещение
        store.activeNotifications.push({
            message: "test notification",
            status: true,
            id: 0,
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("test notification");

        //нажимаем на оповещение
        await userEvent.click(wrapper.element.children[0].children[0]);

        //оповещение должно закрыться
        expect(wrapper.text()).toBe("");
    });
});
