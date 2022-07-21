import { useCollections } from "@/store/collections";
import { computed, ref, watch } from "vue";

export default function () {
  const collectionsStore = useCollections();
  //изображения в текущей коллекции
  const images = ref(collectionsStore.activeCollection!.arr);

  //хэш проверяемого изображения
  const hash = ref<string | null>(null);

  //схожие изображения
  const doublicateImages = ref<Array<ImageSingle>>([]);

  const haveDoubles = computed(() => {
    return doublicateImages.value.length != 0;
  });
  /**
   * При изменении хэша получение схожих изображений.
   */
  watch(
    () => hash.value,
    (newHash) => {
      if (newHash == null || newHash == "") {
        doublicateImages.value = [];
      } else {
        const t: ImageSingle[] = [];
        const temp = images.value.filter((img) => {
          if ("arr" in img) {
            for (const t of img.arr) {
              if (hammingDistance(newHash, t.manifest.hash) < 0.25) {
                return true;
              }
            }
          } else {
            if (hammingDistance(newHash, img.manifest.hash) < 0.25) {
              return true;
            }
          }
          return false;
        });
        doublicateImages.value = [...(temp as any as ImageSingle[]), ...t];
      }
    }
  );

  /**
   * Устанавливает хэш проверяемого изображения для поиска похожих изображений.
   * @param s Хэш строка.
   */
  function setHash(s: string) {
    hash.value = s;
  }

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
