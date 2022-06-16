import { Ref, ref, watch } from "vue";


export default function() {
    const displayedImages = ref<Array<ImageSet | ImageSingle>>([]);

    let displayableImages = ref<Array<ImageSet | ImageSingle>>([]);

    //Установка изображений, которые могут быть отображены
    function setDisplayableImages(data: Ref<Array<ImageSet | ImageSingle>>) {
        displayableImages = data;

        watch(() => [...displayableImages.value], (n, o) => {
            if(n.length > o.length) {
                const newImages = n.filter(i => !o.includes(i));
               displayedImages.value.unshift(...newImages);
            } else if(n.length < o.length) {
                const removedImages = o.filter(i => !n.includes(i));
                for(const image of removedImages) {
                    const index = displayedImages.value.findIndex((i) => i.manifest.id == image.manifest.id);
                    if(index != -1) displayedImages.value.splice(index, 1);
                }
            }
        })
    }

    //Отобразить следующую партию изображений.
    function displayNextImages(count = 15) {
        if(displayedImages.value.length >= displayableImages.value.length) return false;
        const temp = displayableImages.value.slice(displayedImages.value.length, displayedImages.value.length + count);
        displayedImages.value.push(...temp);
        return true;
    }

    //сбросить отображаемые изображения.
    function resetDisplayedImages(filtered = true) {
        displayedImages.value = [];
    }


    return {
        setDisplayableImages,
        displayedImages,
        displayNextImages,
        resetDisplayedImages
    }
}