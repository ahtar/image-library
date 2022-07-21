interface Callback {
    (value: any, oldValue: any): void;
}

import { Ref, ref, watch } from "vue";

import { useCollections } from "@/store/collections";

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
    function addTag(data: string | Tag) {
        if (typeof data == "string") {
            /*const tag = collectionsStore.activeCollection?.tags.find(tag => tag.name == data) 
                  || {name: data, count: 0};*/
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
    function removeTag(tag: Tag | string, index: number) {
        tags.value.splice(index, 1);
    }

    /**
     * выполняет действие при изменении массива с тегами.
     * @param callback Функция, вызываемая при добавлении или удалении тегов.
     */
    function tagsOnChange(callback: Callback) {
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
    function setTagRef(ref: Ref<Array<string>>) {
        tags = ref;
    }

    function setDefinedTags(tags: Array<Tag>) {
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
