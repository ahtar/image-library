import { defineStore } from 'pinia';
import i18n from '@/locales/i18n';
import { set, get } from 'idb-keyval';

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
            idb: {
                language: false,
                directoryHandle: false,
            },
            showTooltips: true,
            showCardAnimations: true,
            visible: false,
            directoryHandle: null as FileSystemDirectoryHandle | null,
            collectionSidebarVisible: true,
        };
    },
    actions: {
        async saveSettings(key: IDBValidKey, data: any) {
            await set(key, data);
        },

        /**
         * Получение пользовательских настроек из idb
         */
        async loadSettings() {
            const languageData = await get('language');
            const tooltipsData = await get('tooltips');
            const cardAnimationsData = await get('cardAnimations');
            const directoryHandle = await get('directoryHandle');

            if (languageData !== undefined) {
                this.changeLanguage(languageData);
                this.idb.language = true;
            }

            if (tooltipsData !== undefined) this.showTooltips = tooltipsData;

            if (cardAnimationsData !== undefined)
                this.showCardAnimations = cardAnimationsData;

            if (directoryHandle !== undefined) {
                this.directoryHandle = directoryHandle;
                this.idb.directoryHandle = directoryHandle;
            }
        },

        /**
         * Определить предпочитаемый язык пользователя
         */
        setupLanguage() {
            if (this.idb.language) return;
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

        /**
         * Сменить язык пользователя
         * @param language новый язык
         */
        changeLanguage(language: string) {
            i18n.global.locale.value = language;
            this.language.appLanguage = language;
        },

        /**
         * Открыть окно выбора каталога.
         * @returns Выбранный каталог.
         */
        async getDirectoryHandle() {
            this.directoryHandle = await window.showDirectoryPicker();
            return this.directoryHandle;
        },

        /**
         * Проверить разрешения.
         * @returns Статус разрешений
         */
        async verifyPermission() {
            const options: FileSystemHandlePermissionDescriptor = {
                mode: 'readwrite',
            };

            if (!this.directoryHandle) return false;

            if (
                (await this.directoryHandle.queryPermission(options)) ==
                'granted'
            )
                return true;

            return false;
        },
    },
});
