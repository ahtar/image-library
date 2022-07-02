<template>
    <div class="tag-input-wrapper" ref="input">
        <input-text :important="true" label="Теги" placeholder="Тег" :active="true" class="input-tag" v-model="item" @enterKey="createTag" @quickSuggestion="quickSuggestion" :tabindex="tabindex"/>
        <div class="tag-container">
            <div class="container">
                <card-tag-small v-for="(tag, i) in tags" :key="i" :tag="getTagObject(tag)" @click="removeTag(tag, i)" data-test="tag-container"/>
            </div>
        </div>
        <div class="suggestions" v-if="suggestionsVisible">
            <card-tag-small v-for="(tag, i) in suggestedTags" :key="i" :tag="tag" @click="getTag(tag)" data-test="input-tag-suggestion"/>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'

import InputText from '@/components/InputText.vue'
import CardTagSmall from '@/components/CardTagSmall.vue'

export default defineComponent({
    components: {
        InputText,
        CardTagSmall,
    },

    props: {
        tags: {
            type: Array as PropType<string[]>,
            required: true,
        },
        definedTags: {
            type: Array as PropType<Tag[]>,
            default: () => {
                return [];
            }
        },
        suggest: {
            type: Boolean,
            default: true
        },
        tabindex: {
            type: Number,
            default: 0
        }
    },

    emits: ['add', 'remove'],

    setup(props, { emit }) {

        /**
         * Ref для InputText, хранит введенный текст.
         */
        const item = ref('');
        const input = ref<HTMLElement | null>(null);

        /**
         * Существующие теги, подходящие под запрос.
         */
        const filteredTags = computed(() => {
            if(item.value == '') {
                return [];
            } else {
                const input = item.value.toLowerCase();
                return props.definedTags.filter((tag) => {
                    if(tag.name.toLowerCase().includes(input)) return true;
                    return false;
                });
            }
        });

        /**
         * Первые 10 предложенных тегов, не имеющих уже существующих дубликатов в массиве с тегами.
         */
        const suggestedTags = computed(() => {
            return filteredTags.value.filter((tag) => {
                for(let i = 0; i < props.tags!.length; i++) {
                    let a = props.tags![i] as string;
                    if(a == tag.name) {
                        return false;
                    }
                }
                return true;
            }).slice(0, 10);
        });

        const suggestionsVisible = computed(()=> {
            if(suggestedTags.value.length > 0 && props.suggest) {
                return true;
            } else {
                return false;
            }
        });

        /**
         * Событие на добавление тега, если этот тег не дубликат.
         */
        function createTag() {
            for(const tag of props.tags as Array<string>) {
                if(tag == item.value) {
                    item.value = '';
                    return;
                }
            }
            emit('add', item.value);
            item.value = '';
        }

        /**
         * Событие на удаление тега.
         */
        function removeTag(tag: any, index: number) {
            emit('remove', tag, index);
        }

        function tagName(tag: Tag | string) {
            if(typeof tag == 'string') {
                return tag;
            } else if(typeof tag == 'object') {
                return tag.name;
            }
        }
        /**
         * Событие на добавление предложенного тега.
         */
        function getTag(tag: Tag) {
            if(!props.tags?.includes(tag.name)) {
                emit('add', tag);
            }
            item.value = '';
            input.value?.querySelector<HTMLInputElement>('.input > .focusable')?.focus();
        }

        /**
         * Быстрое автозаполнение строки ввода первым предложенным тегом.
         */
        function quickSuggestion() {
            if(suggestedTags.value.length > 0) {
                item.value = suggestedTags.value[0].name;
            } 
        }

        /**
         * Получение объекта тега из существующих в коллекции тегов.
         * @param tag Название тега.
         */
        function getTagObject(tag: string) {
            const t = props.definedTags.find((t) => t.name == tag);

            if(t) {
                return t;
            } else {
                return {
                    name: tag,
                    count: 0
                }
            }
        }

        return {
            item,
            input,
            suggestionsVisible,
            createTag,
            removeTag,
            tagName,
            suggestedTags,
            getTag,
            quickSuggestion,
            getTagObject,
        }
    },
})
</script>


<style lang="scss" scoped>
    .tag-input-wrapper {
        background-color: $color-dark-2;
        border: thin solid $color-border-dark-2;
        height:40vh;
        border-radius: $radius-big;
        position: relative;
        margin-top: 15px;
        width: 100%;
        display: flex;
        flex-direction: column;
        @include z-depth(2);

        .card-tag-small {
            margin: 7px;
        }


        .input-tag {
            border: none;
            border-bottom: thin solid $color-border-dark-4;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            box-shadow: none;
            flex-shrink: 0;
            margin: 0;
        }

        .tag-container {
            height: auto;
            overflow-y: auto;
            @include scroll();

            .container {
                display: flex;
                flex-wrap: wrap;
            }
        }

        .suggestions {
            position: absolute;
            top: -1px;
            right: -10px;
            transform: translateX(100%);
            padding: 10px;
            max-width: 150px;
            background-color: $section-color;
            border: thin solid $section-border-color;
            border-radius: 5px;
            @include box-shadow;
            @include flex-start;
        }

    }
</style>