import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SettingKey =
	| "projectUpdates"
	| "taskAssignments"
	| "taskComments"
	| "dueDateReminders"
	| "teamInvitations"
	| "memberActivity"
	| "emailDigest"
	| "browserPush";

export type NotificationType =
	| "task"
	| "project"
	| "team"
	| "comment"
	| "system";

interface NotificationToggle {
	key: SettingKey;
	title: string;
	description: string;
}

export interface NotificationSection {
	title: string;
	description: string;
	toggles: NotificationToggle[];
}

export type NotificationSettings = Record<SettingKey, boolean>;

export interface AppNotification {
	id: string;
	title: string;
	description: string;
	date: string;
	read: boolean;
	/** Notification category — used to pick the icon on the notification page */
	type: NotificationType;
	/** Optional URL to navigate to when the notification is clicked */
	href?: string;
}

interface NotificationState {
	settings: NotificationSettings;
	sections: NotificationSection[];
	inbox: AppNotification[];
	isLoading: boolean;
	error: string | null;

	// Actions
	toggleSetting: (key: SettingKey) => void;
	updateSetting: (key: SettingKey, value: boolean) => void;
	resetSettings: () => void;
	saveSettings: () => Promise<void>;

	addNotification: (
		notification: Omit<AppNotification, "id" | "date" | "read">,
	) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	clearInbox: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_INBOX_SIZE = 50;

// ─── Static Data ──────────────────────────────────────────────────────────────

const DEFAULT_SECTIONS: NotificationSection[] = [
	{
		title: "Project Notifications",
		description: "Control alerts related to your projects and their status.",
		toggles: [
			{
				key: "projectUpdates",
				title: "Project Updates",
				description: "Receive notifications when a project status changes.",
			},
			{
				key: "taskAssignments",
				title: "Task Assignments",
				description: "Get notified when a task is assigned to you.",
			},
			{
				key: "taskComments",
				title: "Task Comments",
				description: "Be alerted when someone comments on your tasks.",
			},
			{
				key: "dueDateReminders",
				title: "Due Date Reminders",
				description: "Reminders 24 hours before a task is due.",
			},
		],
	},
	{
		title: "Team Notifications",
		description: "Stay informed about team activity and membership changes.",
		toggles: [
			{
				key: "teamInvitations",
				title: "Team Invitations",
				description: "Notifications for new team invitations.",
			},
			{
				key: "memberActivity",
				title: "Member Activity",
				description: "Updates when team members complete or create tasks.",
			},
		],
	},
	{
		title: "Delivery Preferences",
		description: "Choose how and where you receive your notifications.",
		toggles: [
			{
				key: "emailDigest",
				title: "Email Digest",
				description: "Receive a daily summary of activity via email.",
			},
			{
				key: "browserPush",
				title: "Browser Push",
				description: "Enable push notifications in your browser.",
			},
		],
	},
];

const DEFAULT_SETTINGS: NotificationSettings = {
	projectUpdates: true,
	taskAssignments: true,
	taskComments: false,
	dueDateReminders: true,
	teamInvitations: true,
	memberActivity: false,
	emailDigest: true,
	browserPush: false,
};

// ─── Store Implementation ──────────────────────────────────────────────────────

export const useNotificationStore = create<NotificationState>()(
	persist(
		(set, get) => ({
			settings: DEFAULT_SETTINGS,
			sections: DEFAULT_SECTIONS,
			inbox: [],
			isLoading: false,
			error: null,

			toggleSetting: (key: SettingKey) => {
				set((state) => ({
					settings: {
						...state.settings,
						[key]: !state.settings[key],
					},
				}));
			},

			updateSetting: (key: SettingKey, value: boolean) => {
				set((state) => ({
					settings: {
						...state.settings,
						[key]: value,
					},
				}));
			},

			resetSettings: () => {
				set({ settings: DEFAULT_SETTINGS });
			},

			saveSettings: async () => {
				set({ isLoading: true, error: null });
				try {
					const { settings } = get();
					console.log("Saving notification settings:", settings);
					set({ isLoading: false });
				} catch (err) {
					set({
						error:
							err instanceof Error ? err.message : "Failed to save settings",
						isLoading: false,
					});
				}
			},

			addNotification: (notification) => {
				set((state) => {
					const newItem: AppNotification = {
						...notification,
						id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
						date: new Date().toISOString(),
						read: false,
					};
					// Prepend and cap at MAX_INBOX_SIZE to prevent unbounded growth
					const updated = [newItem, ...state.inbox].slice(0, MAX_INBOX_SIZE);
					return { inbox: updated };
				});
			},

			markAsRead: (id: string) => {
				set((state) => ({
					inbox: state.inbox.map((n) =>
						n.id === id ? { ...n, read: true } : n,
					),
				}));
			},

			markAllAsRead: () => {
				set((state) => ({
					inbox: state.inbox.map((n) => ({ ...n, read: true })),
				}));
			},

			clearInbox: () => {
				set({ inbox: [] });
			},
		}),
		{
			name: "notification-store",
			partialize: (state) => ({ settings: state.settings, inbox: state.inbox }),
		},
	),
);
