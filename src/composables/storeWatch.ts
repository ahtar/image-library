import { watch } from 'vue';
import { useSettings } from '@/store/settings';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
    const storeSettings = useSettings();

    function watchSettings() {
        //выбранный пользователем язык
        watch(
            () => storeSettings.language.appLanguage,
            (data) => {
                storeSettings.saveSettings('language', data);
            }
        );

        //Показ tooltip
        watch(
            () => storeSettings.showTooltips,
            (data) => {
                storeSettings.saveSettings('tooltips', data);
            }
        );

        watch(
            () => storeSettings.directoryHandle,
            (data) => {
                if (data) {
                    storeSettings.saveSettings('directoryHandle', data);
                }
            }
        );

        watch(
            () => storeSettings.showCardAnimations,
            (data) => {
                storeSettings.saveSettings('cardAnimations', data);
            }
        );
    }

    return {
        watchSettings,
    };
}
