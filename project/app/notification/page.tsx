"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header/PageHeader";

export default function NotificationsPage() {
    const [settings, setSettings] = useState({
        emailAssigned: true,
        emailMentions: true,
        emailComments: false,
        emailDigest: true,
        pushTaskUpdates: true,
        pushDeadlines: true,
        slackIntegration: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <PageHeader
                title="Notifications"
                description="Manage how you receive updates about your projects, tasks, and team activity."
            />

            <div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-800">
                {/* Project Activity & Tasks */}
                <div className="pt-4 first:pt-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Task & Project Activity
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Get notified when changes happen on tasks and boards you follow.
                    </p>
                    <div className="space-y-4">
                        <ToggleItem
                            title="Task Assignment"
                            description="Notify me when I am assigned to a new task or subtask."
                            checked={settings.emailAssigned}
                            onChange={() => handleToggle("emailAssigned")}
                        />
                        <ToggleItem
                            title="Mentions"
                            description="Notify me when someone tags me in a comment or description."
                            checked={settings.emailMentions}
                            onChange={() => handleToggle("emailMentions")}
                        />
                        <ToggleItem
                            title="Comments & Replies"
                            description="Notify me when someone comments on a task I created or am watching."
                            checked={settings.emailComments}
                            onChange={() => handleToggle("emailComments")}
                        />
                    </div>
                </div>

                {/* Deadlines & Reminders */}
                <div className="pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Deadlines & Schedule
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Stay on top of your sprint goals and delivery dates.
                    </p>
                    <div className="space-y-4">
                        <ToggleItem
                            title="Due Date Reminders"
                            description="Receive alerts 24 hours before a task is due."
                            checked={settings.pushDeadlines}
                            onChange={() => handleToggle("pushDeadlines")}
                        />
                        <ToggleItem
                            title="Daily Project Digest"
                            description="Receive a summary of today's due tasks and project progress every morning."
                            checked={settings.emailDigest}
                            onChange={() => handleToggle("emailDigest")}
                        />
                    </div>
                </div>

                {/* Integrations */}
                <div className="pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Integrations & Real-time Alerts
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Connect your workspace channels for instant updates.
                    </p>
                    <div className="space-y-4">
                        <ToggleItem
                            title="Real-time Push Notifications"
                            description="Show browser notifications when live changes occur."
                            checked={settings.pushTaskUpdates}
                            onChange={() => handleToggle("pushTaskUpdates")}
                        />
                        <ToggleItem
                            title="Slack / Chat Channel Alerts"
                            description="Forward critical project alerts directly to your team communication app."
                            checked={settings.slackIntegration}
                            onChange={() => handleToggle("slackIntegration")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Toggle Component
function ToggleItem({
    title,
    description,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    checked ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </button>
        </div>
    );
}