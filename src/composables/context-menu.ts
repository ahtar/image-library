import { ref } from "vue";

interface Action<T> {
    (item: T): void;
}

type IMenuItem = ImageSingle | ImageSet

export default function() {

    const contextMenuActive = ref(false);
    const contextMenuEvent = ref<MouseEvent | null>(null);
    const contextMenuItem = ref<IMenuItem>();

    /**
     * Открывает контекст меню в месте клика мышью.
     * @param item Объект, на котором было вызвано контекст меню.
     * @param event Event, с помощью которого было вызвано контекст меню. Необходимо для позиционарования этого меню относительно места клика.
     */
    function contextMenuOpen(item: IMenuItem, event: MouseEvent) {
        event.preventDefault();
        contextMenuEvent.value = event;
        contextMenuItem.value = item;
        contextMenuActive.value = true;
    }
    /**
     * Закрывает открытое контекст меню.
     */
    function contextMenuClose() {
        contextMenuActive.value = false;
    }

    /**
     * Do something on context menu button click.
     * @param callback Callback function, with object on which the action was called.
     */
    function contextMenuAction(callback: Action<IMenuItem>) {
        callback(contextMenuItem.value!);
        contextMenuActive.value = false;
    }

    return {
        contextMenuActive,
        contextMenuEvent,
        contextMenuOpen,
        contextMenuClose,
        contextMenuAction,
    }
}