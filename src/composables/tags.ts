interface Callback {
    (value: string[], oldValue: string[]): void;
}

import { Ref, ref, watch } from 'vue';

import { useCollections } from '@/store/collections';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    const storeCollections = useCollections();

    /**
     * Ref на массив с тегами.
     */
    let tags = ref<Array<string>>([]);

    /**
     * Существующие теги в коллекции.
     */
    const definedTags = ref<Array<Tag>>([]);

    const customDefinedTags = ref(false);

    //Инициализация тегов коллекции и реагирование на изменение активной коллекции.
    if (storeCollections.activeCollection)
        definedTags.value = storeCollections.activeCollection.tags;
    watch(
        () => storeCollections.activeCollection,
        () => {
            if (!customDefinedTags.value && storeCollections.activeCollection) {
                definedTags.value = storeCollections.activeCollection.tags;
            }
        }
    );

    /**
     * Добавляет данный тег в массив с тегами.
     * В массиве изображения тег должен быть строкой.
     * @param data Тег, который нужно добавить.
     */
    function addTag(data: string | Tag): void {
        if (typeof data == 'string') {
            tags.value.push(data);
        } else {
            tags.value.push(data.name);
        }
    }
    /**
     * Удаляет тег из массива.
     * @param tag Удаляемый тег.
     * @param index Индекс тега в массиве.
     */
    function removeTag(tag: Tag | string, index: number): void {
        tags.value.splice(index, 1);
    }

    /**
     * выполняет действие при изменении массива с тегами.
     * @param callback Функция, вызываемая при добавлении или удалении тегов.
     */
    function tagsOnChange(callback: Callback): void {
        watch(
            () => [...tags.value],
            (value, oldValue) => {
                callback(value, oldValue);
            }
        );
    }

    /**
     * Заменяет внутренний массив с тегами на внешний.
     * Позволяет внутренним функциям работать с внешним массивом тегов.
     * @param ref Ref на массив с тегами.
     */
    function setTagRef(ref: Ref<Array<string>>): void {
        tags = ref;
    }

    function setDefinedTags(tags: Array<Tag>): void {
        definedTags.value = tags;
        customDefinedTags.value = true;
    }

    return {
        tags,
        definedTags,
        addTag,
        removeTag,
        tagsOnChange,
        setTagRef,
        setDefinedTags,
    };
}
