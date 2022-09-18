import { useCollections } from '@/store/collections';
import { computed, ref, watch } from 'vue';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    const collectionsStore = useCollections();

    //ИЗображения активной коллекции.
    const images = ref(collectionsStore.activeCollection?.arr);

    //Хэш проверяемого изображения.
    const hash = ref<string | null>(null);

    //Схожие изображения.
    const doublicateImages = ref<Array<ImageSingle | ImageSet>>([]);

    //Есть ли схожие изображения.
    const haveDoubles = computed(() => {
        return doublicateImages.value.length != 0;
    });

    //Поиск схожих изображений при изменении хеша.
    watch(
        () => hash.value,
        (newHash) => {
            if (newHash == null || newHash == '') {
                doublicateImages.value = [];
                return;
            }

            if (!images.value) return [];

            const temp = images.value.filter((img) => {
                if ('arr' in img) {
                    for (const t of img.arr) {
                        if (hammingDistance(newHash, t.manifest.hash) < 0.25) {
                            return true;
                        }
                    }
                    return false;
                }

                if (hammingDistance(newHash, img.manifest.hash) < 0.25) {
                    return true;
                }
                return false;
            });

            doublicateImages.value = [...temp];
        }
    );

    /**
     * Изменение хеша проверяемого изображения.
     * @param s Хэш строка.
     */
    function setHash(s: string) {
        hash.value = s;
    }

    /**
     * Сравнение 2 хешей
     * @param s1 Первый хеш.
     * @param s2 Второй хеш.
     * @returns значение от 0 до 1.
     */
    function hammingDistance(s1: string, s2: string) {
        let counter = 0;
        for (let k = 0; k < s1.length; k++) {
            if (s1[k] !== s2[k]) {
                counter++;
            }
        }
        return counter / s1.length;
    }

    return {
        doublicateImages,
        setHash,
        hammingDistance,
        haveDoubles,
    };
}
