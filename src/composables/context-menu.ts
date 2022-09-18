import { ref } from 'vue';

interface Action<T> {
    (item: T): void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    const contextMenuActive = ref(false);
    const contextMenuEvent = ref<MouseEvent | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contextMenuItem = ref<any>();

    /**
     * Открывает контекст меню в месте клика мышью.
     * @param item Объект, на котором было вызвано контекст меню.
     * @param event Event, с помощью которого было вызвано контекст меню. Необходимо для позиционарования этого меню относительно места клика.
     */
    function contextMenuOpen(item: ContextMenuItem, event: MouseEvent): void {
        event.preventDefault();
        contextMenuEvent.value = event;
        contextMenuItem.value = item;
        contextMenuActive.value = true;
    }

    /**
     * Закрывает открытое контекст меню.
     */
    function contextMenuClose(): void {
        contextMenuActive.value = false;
    }

    /**
     * Действие над элементом.
     * @param callback Функция.
     */
    function contextMenuAction<T>(callback: Action<T>): void {
        if (!contextMenuItem.value) return;
        callback(contextMenuItem.value);
        contextMenuActive.value = false;
    }

    return {
        contextMenuActive,
        contextMenuEvent,
        contextMenuOpen,
        contextMenuClose,
        contextMenuAction,
    };
}
