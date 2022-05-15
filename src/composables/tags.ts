interface Callback {
    (value: any, oldValue: any): void
}



import { useCollections } from '@/store/collections'
import { Ref, ref, watch } from "vue";


export default function() {

    const collectionsStore = useCollections();

    /**
     * Ref на массив с тегами.
     * Уникален для каждого вызова Composable.
     */
    let tags = ref<Array<string>>([]);

    /**
     * Существующие теги в коллекции.
     */
    const definedTags = ref(collectionsStore.activeCollection!.tags);


    /**
     * Добавляет данный тег в массив с тегами.
     * В массиве изображения тег должен быть строкой.
     * @param data Тег, который нужно добавить.
     */
    function addTag(data: string | Tag) {
        if(typeof data == 'string') {
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
        watch(() => [...tags.value], (value, oldValue) => {
            callback(value, oldValue);
        });
    }

    /**
     * Заменяет внутренний массив с тегами на внешний.
     * Позволяет внутренним функциям работать с внешним массивом тегов.
     * @param ref Ref на массив с тегами.
     */
    function setTagRef(ref: Ref<Array<string>>) {
        tags = ref;
    }

    return {
        tags,
        definedTags,
        addTag,
        removeTag,
        tagsOnChange,
        setTagRef,
    }
}