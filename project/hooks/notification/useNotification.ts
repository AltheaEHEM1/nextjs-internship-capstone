import {
    useNotificationStore,
    type NotificationSection,
    type NotificationSettings,
    type SettingKey,
} from "@/stores/notification/NotificationStore";

export interface UseNotificationReturn {
    settings: NotificationSettings;
    sections: NotificationSection[];
    isLoading: boolean;
    error: string | null;
    handleToggle: (key: SettingKey) => void;
    handleUpdateSetting: (key: SettingKey, value: boolean) => void;
    handleReset: () => void;
    handleSave: () => Promise<void>;
}

export function useNotification(): UseNotificationReturn {
    const {
        settings,
        sections,
        isLoading,
        error,
        toggleSetting,
        updateSetting,
        resetSettings,
        saveSettings,
    } = useNotificationStore();

    return {
        settings,
        sections,
        isLoading,
        error,
        handleToggle: toggleSetting,
        handleUpdateSetting: updateSetting,
        handleReset: resetSettings,
        handleSave: saveSettings,
    };
}