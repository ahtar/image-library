import { defineStore } from 'pinia'

export const usePromptStore = defineStore('prompt', {
    state: () => {
        return {
            visible: false,
            message: '',
            type: '',
            action: null as null | ((status: boolean) => void),
        }
    },

    actions: {
        /**
         * Показывает диалоговое окно, возвращает Promise с подтверждением, отрицанием
         * @param text Текст диалогового окна
         * @param type Тип диалогового окна
         * @returns Boolean
         */
         showPrompt(text = 'placeholder', type: 'confirmation' | 'notification' = 'notification') {
            return new Promise<boolean>((resolve) => {
                this.visible = true;
                this.type = type;
                this.message = text;
                this.action = function(status = true) {
                    if(status) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        }
    },
});