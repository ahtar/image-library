import { defineStore } from 'pinia';
import i18n from '@/locales/i18n';

export const useSettings = defineStore('settings', {
    state: () => {
        return {
            language: {
                languageData: [
                    ['en', 'EN'],
                    ['ru', 'RU'],
                ] as [string, string][],
                userLanguages: navigator.languages,
                appLanguage: i18n.global.locale.value,
            },
        };
    },
    actions: {
        //Определить предпочитаемый язык пользователя
        setupLanguage() {
            for (let i = 0; i < this.language.userLanguages.length; i++) {
                const language = this.language.userLanguages[i];
                for (let j = 0; j < this.language.languageData.length; j++) {
                    const langDataArray = this.language.languageData[j];
                    if (langDataArray.includes(language)) {
                        this.changeLanguage(language);
                        return;
                    }
                }
            }
        },

        //сменить язык интерфейса
        changeLanguage(language: string) {
            i18n.global.locale.value = language;
            this.language.appLanguage = language;
        },
    },
});
