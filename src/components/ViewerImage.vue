<template>
    <div class="viewer-image-wrapper" @mouseup="moveEnd" @mousemove="move" ref="imageWrapper">
        <img alt="Image" ref="img" @wheel="scale" @mousedown="moveStart" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, PropType, ref } from "vue";
import useRerenderImage from "@/composables/image-rendering";

export default defineComponent({
    props: {
        image: {
            type: Object as PropType<ImageSingle>,
            required: true,
        },
    },
    setup(props) {
        const { renderImage } = useRerenderImage();
        //Ref на изображение.
        const img = ref<HTMLImageElement | null>(null);
        //Ref на контейнер изображения.
        const imageWrapper = ref<HTMLElement | null>(null);
        //Зажата ли кнопка мыши.
        let moving = false;
        //Координата предыдущего движения или клика мыши.
        let moveIndex = {
            x: 0,
            y: 0,
        };
        //Х и У пиксели для трансформации контейнера.
        let transform = {
            x: 0,
            y: 0,
        };

        onMounted(async () => {
            try {
                if (img.value != null) {
                    await renderImage(img.value, await props.image.getImage());
                }
            } catch (err) {
                console.log(err);
            }
        });

        onUpdated(async () => {
            try {
                if (img.value != null) {
                    await renderImage(img.value, await props.image.getImage());
                }
            } catch (err) {
                console.log(err);
            }
        });

        //Увеличение или уменьшение изображения при прокрутке колеса мыши.
        //Фокусируется в точку, в которую указывает курсор мыши.
        function scale(event: WheelEvent) {
            if (img.value) {
                //Координаты изображения.
                const targetRect = (
                    event.currentTarget as HTMLElement
                ).getBoundingClientRect();

                //Координаты курсора относительно изображения.
                const imagePoint = {
                    x: event.pageX - targetRect.left,
                    y: event.pageY - targetRect.top,
                };

                //Координаты курсора относительно экрана.
                const screenPoint = {
                    x: event.pageX,
                    y: event.pageY,
                };

                if (img.value.style.maxHeight == "") {
                    img.value.style.height = img.value.height + "px";
                    img.value.style.maxHeight = "none";
                    img.value.style.maxWidth = "none";
                }

                //Увеличение/уменьшение изображения.
                if (event.deltaY < 0) {
                    img.value.style.height = img.value.height + 50 + "px";
                } else {
                    img.value.style.height = img.value.height - 50 + "px";
                }

                //Новые координаты изображения.
                const newTargetRect = (
                    event.currentTarget as HTMLElement
                ).getBoundingClientRect();

                //Координаты курсора относительно изображения в процентах.
                const percentage = {
                    x: imagePoint.x / (targetRect.width / 100),
                    y: imagePoint.y / (targetRect.height / 100),
                };

                //Координаты той же самой точки относительно измененного изображения.
                const newImagePoint = {
                    x: percentage.x * (newTargetRect.width / 100),
                    y: percentage.y * (newTargetRect.height / 100),
                };

                //Новые координаты той же самой точки относительно экрана.
                const newScreenPoint = {
                    x: newImagePoint.x + newTargetRect.left,
                    y: newImagePoint.y + newTargetRect.top,
                };

                //Разница в координатах между 2 точками на экране.
                const diff = {
                    x: Math.round(newScreenPoint.x - screenPoint.x),
                    y: Math.round(newScreenPoint.y - screenPoint.y),
                };

                transform.x -= diff.x;
                transform.y -= diff.y;

                //Перемещение изображения на разницу в координатах.
                imageWrapper.value!.style.transform = `translate(${transform.x}px,${transform.y}px)`;
            }
        }

        function moveStart(event: MouseEvent) {
            moving = true;
            moveIndex.x = event.x;
            moveIndex.y = event.y;
        }

        function moveEnd(event: MouseEvent) {
            moving = false;
        }

        //Перемещение контейнера с изорбажением.
        function move(event: MouseEvent) {
            if (moving) {
                const x = event.x - moveIndex.x;
                const y = event.y - moveIndex.y;

                moveIndex.x = event.x;
                moveIndex.y = event.y;

                transform.x += x;
                transform.y += y;

                imageWrapper.value!.style.transform = `translate(${transform.x}px,${transform.y}px)`;
            }
        }

        return {
            img,
            imageWrapper,
            scale,
            moveStart,
            move,
            moveEnd,
        };
    },
});
</script>

<style lang="scss" scoped>
.viewer-image-wrapper {
    max-height: inherit;
    max-width: inherit;

    img {
        max-height: inherit;
        max-width: inherit;
        -webkit-user-drag: none;
    }
}
</style>
