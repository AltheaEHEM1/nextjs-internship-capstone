import { create } from "zustand";

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

export interface NotificationToggle {
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

interface NotificationState {
    settings: NotificationSettings;
    sections: NotificationSection[];
    isLoading: boolean;
    error: string | null;

    // Actions
    toggleSetting: (key: SettingKey) => void;
    updateSetting: (key: SettingKey, value: boolean) => void;
    resetSettings: () => void;
    saveSettings: () => Promise<void>;
}

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

export const useNotificationStore = create<NotificationState>((set, get) => ({
    settings: DEFAULT_SETTINGS,
    sections: DEFAULT_SECTIONS,
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
            // Replace with database / API sync logic when backend is connected
            console.log("Saving notification settings:", settings);
            set({ isLoading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to save settings",
                isLoading: false,
            });
        }
    },
}));