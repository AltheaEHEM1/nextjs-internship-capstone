"use client";

import { Check, CheckCircle2, Inbox } from "lucide-react";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useNotification } from "@/hooks/notification/useNotification";

export default function NotificationsPage() {
	const { inbox, markAsRead, markAllAsRead, clearInbox } = useNotification();

	return (
		<div className="max-w-4xl space-y-6">
			<div className="flex items-start justify-between">
				<PageHeader
					title="Notifications"
					description="Stay updated with your latest alerts."
				/>
				{inbox.length > 0 && (
					<div className="flex gap-2 mt-2">
						<button
							type="button"
							onClick={markAllAsRead}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
						>
							<CheckCircle2 className="w-4 h-4" />
							Mark all read
						</button>
						<button
							type="button"
							onClick={clearInbox}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 dark:bg-slate-800 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
						>
							Clear all
						</button>
					</div>
				)}
			</div>

			<div className="pt-4">
				<div className="space-y-3">
					{inbox.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-slate-200 dark:border-slate-800">
							<div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-slate-100 dark:bg-slate-800">
								<Inbox className="w-6 h-6 text-slate-400" />
							</div>
							<h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
								You're all caught up
							</h3>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								No new notifications to show right now.
							</p>
						</div>
					) : (
						inbox.map((notification) => (
							<div
								key={notification.id}
								className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
									notification.read
										? "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 opacity-70"
										: "bg-cyan-50/50 border-cyan-100 dark:bg-cyan-900/10 dark:border-cyan-900/30 shadow-sm"
								}`}
							>
								<div className="space-y-1">
									<h4
										className={`text-sm font-semibold ${
											notification.read
												? "text-slate-700 dark:text-slate-300"
												: "text-slate-900 dark:text-slate-100"
										}`}
									>
										{notification.title}
									</h4>
									<p className="text-sm text-slate-600 dark:text-slate-400">
										{notification.description}
									</p>
									<span className="block pt-1 text-xs text-slate-500">
										{new Date(notification.date).toLocaleString()}
									</span>
								</div>
								{!notification.read && (
									<button
										type="button"
										onClick={() => markAsRead(notification.id)}
										className="p-1.5 text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors dark:text-cyan-400 dark:hover:bg-cyan-900/30"
										title="Mark as read"
									>
										<Check className="w-4 h-4" />
									</button>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
