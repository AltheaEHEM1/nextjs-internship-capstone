// Notification Zustand store

import type { LucideIcon } from "lucide-react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface NotificationSettings {
	emailAssigned: boolean;
	emailMentions: boolean;
	emailComments: boolean;
	emailDigest: boolean;
	pushTaskUpdates: boolean;
	pushDeadlines: boolean;
	slackIntegration: boolean;
}

export interface NotificationToggle {
	key: keyof NotificationSettings;
	title: string;
	description: string;
}

export interface NotificationSection {
	title: string;
	description: string;
	toggles: NotificationToggle[];
}

export interface NotificationState {
	settings: NotificationSettings;
	toggleSetting: (key: keyof NotificationSettings) => void;
	sections: NotificationSection[];
}

export const useNotificationStore = create<NotificationState>()(
	devtools((set, get) => ({
		settings: {
			emailAssigned: true,
			emailMentions: true,
			emailComments: false,
			emailDigest: true,
			pushTaskUpdates: true,
			pushDeadlines: true,
			slackIntegration: true,
		},
		toggleSetting: (key) =>
			set((state) => ({
				settings: { ...state.settings, [key]: !state.settings[key] },
			})),
		sections: [
			{
				title: "Task & Project Activity",
				description:
					"Get notified when changes happen on tasks and boards you follow.",
				toggles: [
					{
						key: "emailAssigned",
						title: "Task Assignment",
						description:
							"Notify me when I am assigned to a new task or subtask.",
					},
					{
						key: "emailMentions",
						title: "Mentions",
						description:
							"Notify me when someone tags me in a comment or description.",
					},
					{
						key: "emailComments",
						title: "Comments & Replies",
						description:
							"Notify me when someone comments on a task I created or am watching.",
					},
				],
			},
			{
				title: "Deadlines & Schedule",
				description: "Stay on top of your sprint goals and delivery dates.",
				toggles: [
					{
						key: "pushDeadlines",
						title: "Due Date Reminders",
						description: "Receive alerts 24 hours before a task is due.",
					},
					{
						key: "emailDigest",
						title: "Daily Project Digest",
						description:
							"Receive a summary of today's due tasks and project progress every morning.",
					},
				],
			},
			{
				title: "Integrations & Real-time Alerts",
				description: "Connect your workspace channels for instant updates.",
				toggles: [
					{
						key: "pushTaskUpdates",
						title: "Real-time Push Notifications",
						description: "Show browser notifications when live changes occur.",
					},
					{
						key: "slackIntegration",
						title: "Slack / Chat Channel Alerts",
						description:
							"Forward critical project alerts directly to your team communication app.",
					},
				],
			},
		],
	})),
);
