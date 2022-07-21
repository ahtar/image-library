import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => {
    return {
      activeNotifications: [] as Array<any>,
    };
  },

  actions: {
    /**
     * Показ нового оповещения, последующее удаление оповещения через указанное время.
     * @param message Сообщение оповещения.
     * @param time Время существования оповещения.
     */
    notify(message: string, status = true, time = 5000) {
      const notification = {
        message,
        status,
        id: Math.random() * 1000 * Math.random(),
      };
      this.activeNotifications.push(notification);

      setTimeout(() => {
        this.removeNotification(notification);
      }, time);
    },
    /**
     * Закрытие указанного оповещения.
     * @param notification Объект оповещения.
     */
    removeNotification(notification: any) {
      const index = this.activeNotifications.findIndex(
        (item) => item.id == notification.id
      );
      if (index != -1) {
        this.activeNotifications.splice(index, 1);
      }
    },
  },
});
