"use client";

import { PageHeader } from "@/components/page-header/PageHeader";
import { useNotification } from "@/hooks/notification/useNotification";

export default function NotificationsPage() {
	const { settings, handleToggle, sections } = useNotification();

	return (
		<div className="space-y-6 max-w-4xl">
			<PageHeader
				title="Notifications"
				description="Manage how you receive updates about your projects, tasks, and team activity."
			/>

			<div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-800">
				{sections.map((section, index) => (
					<div
						key={section.title}
						className={index === 0 ? "pt-4 first:pt-0" : "pt-6"}
					>
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
							{section.title}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
							{section.description}
						</p>
						<div className="space-y-4">
							{section.toggles.map((toggle) => (
								<ToggleItem
									key={toggle.key}
									title={toggle.title}
									description={toggle.description}
									checked={settings[toggle.key]}
									onChange={() => handleToggle(toggle.key)}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

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
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{description}
				</p>
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
