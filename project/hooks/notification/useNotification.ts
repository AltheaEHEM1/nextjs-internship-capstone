import {
	type AppNotification,
	type NotificationSection,
	type NotificationSettings,
	type SettingKey,
	useNotificationStore,
} from "@/stores/notification/NotificationStore";

export interface UseNotificationReturn {
	settings: NotificationSettings;
	sections: NotificationSection[];
	inbox: AppNotification[];
	unreadCount: number;
	isLoading: boolean;
	error: string | null;
	handleToggle: (key: SettingKey) => void;
	handleUpdateSetting: (key: SettingKey, value: boolean) => void;
	handleReset: () => void;
	handleSave: () => Promise<void>;
	addNotification: (
		notification: Omit<AppNotification, "id" | "date" | "read">,
	) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	clearInbox: () => void;
}

export function useNotification(): UseNotificationReturn {
	const {
		settings,
		sections,
		inbox,
		isLoading,
		error,
		toggleSetting,
		updateSetting,
		resetSettings,
		saveSettings,
		addNotification,
		markAsRead,
		markAllAsRead,
		clearInbox,
	} = useNotificationStore();

	const unreadCount = inbox.filter((n) => !n.read).length;

	return {
		settings,
		sections,
		inbox,
		unreadCount,
		isLoading,
		error,
		handleToggle: toggleSetting,
		handleUpdateSetting: updateSetting,
		handleReset: resetSettings,
		handleSave: saveSettings,
		addNotification,
		markAsRead,
		markAllAsRead,
		clearInbox,
	};
}
