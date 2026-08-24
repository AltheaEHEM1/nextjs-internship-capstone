"use client";

import {
	Bell,
	Check,
	CheckCircle2,
	CheckSquare,
	FolderKanban,
	Inbox,
	MessageSquare,
	Trash2,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useNotification } from "@/hooks/notification/useNotification";
import type { NotificationType } from "@/stores/notification/NotificationStore";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRelativeTime(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 60) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days === 1) return "yesterday";
	if (days < 7) return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

type IconConfig = {
	Icon: React.ComponentType<{ size?: number; className?: string }>;
	bg: string;
	icon: string;
};

function getIconConfig(type: NotificationType): IconConfig {
	switch (type) {
		case "task":
			return {
				Icon: CheckSquare,
				bg: "bg-cyan-100 dark:bg-cyan-900/30",
				icon: "text-cyan-600 dark:text-cyan-400",
			};
		case "project":
			return {
				Icon: FolderKanban,
				bg: "bg-blue-100 dark:bg-blue-900/30",
				icon: "text-blue-600 dark:text-blue-400",
			};
		case "team":
			return {
				Icon: Users,
				bg: "bg-violet-100 dark:bg-violet-900/30",
				icon: "text-violet-600 dark:text-violet-400",
			};
		case "comment":
			return {
				Icon: MessageSquare,
				bg: "bg-amber-100 dark:bg-amber-900/30",
				icon: "text-amber-600 dark:text-amber-400",
			};
		case "system":
		default:
			return {
				Icon: Bell,
				bg: "bg-slate-100 dark:bg-slate-800",
				icon: "text-slate-500 dark:text-slate-400",
			};
	}
}

function isToday(dateStr: string): boolean {
	const d = new Date(dateStr);
	const now = new Date();
	return (
		d.getFullYear() === now.getFullYear() &&
		d.getMonth() === now.getMonth() &&
		d.getDate() === now.getDate()
	);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
	const router = useRouter();
	const { inbox, markAsRead, markAllAsRead, clearInbox } = useNotification();

	const todayItems = inbox.filter((n) => isToday(n.date));
	const earlierItems = inbox.filter((n) => !isToday(n.date));
	const unreadCount = inbox.filter((n) => !n.read).length;

	function handleClick(id: string, href?: string) {
		markAsRead(id);
		if (href) {
			router.push(href);
		}
	}

	return (
		<div className="max-w-4xl space-y-6">
			{/* Header row */}
			<div className="flex items-start justify-between">
				<div>
					<PageHeader
						title="Notifications"
						description="Stay updated with your latest alerts."
					/>
					{unreadCount > 0 && (
						<span className="mt-1 inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
							{unreadCount} unread
						</span>
					)}
				</div>

				{inbox.length > 0 && (
					<div className="flex gap-2 mt-2 shrink-0">
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
							<Trash2 className="w-4 h-4" />
							Clear all
						</button>
					</div>
				)}
			</div>

			{/* Notification list */}
			<div className="space-y-6">
				{inbox.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
						<div className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-slate-100 dark:bg-slate-800 ring-8 ring-slate-50 dark:ring-slate-900">
							<Inbox className="w-8 h-8 text-slate-400" />
						</div>
						<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
							You're all caught up!
						</h3>
						<p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
							No notifications yet. Actions like task assignments, project
							updates, and team changes will appear here.
						</p>
					</div>
				) : (
					<>
						{/* Today group */}
						{todayItems.length > 0 && (
							<section>
								<h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
									Today
								</h2>
								<div className="space-y-2">
									{todayItems.map((notification) => {
										const { Icon, bg, icon } = getIconConfig(
											notification.type ?? "system",
										);
										const isClickable = !!notification.href;

										return (
											<div
												key={notification.id}
												role={isClickable ? "button" : undefined}
												tabIndex={isClickable ? 0 : undefined}
												onClick={
													isClickable
														? () => handleClick(notification.id, notification.href)
														: undefined
												}
												onKeyDown={
													isClickable
														? (e) => {
																if (e.key === "Enter" || e.key === " ") {
																	handleClick(notification.id, notification.href);
																}
														  }
														: undefined
												}
												className={[
													"group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
													notification.read
														? "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 opacity-70"
														: "bg-cyan-50/60 border-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-900/40 shadow-sm",
													isClickable
														? "cursor-pointer hover:shadow-md hover:-translate-y-px hover:border-cyan-200 dark:hover:border-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
														: "",
												]
													.filter(Boolean)
													.join(" ")}
											>
												{/* Icon */}
												<div
													className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${bg}`}
												>
													<Icon size={18} className={icon} />
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<p
															className={`text-sm font-semibold leading-snug ${
																notification.read
																	? "text-slate-600 dark:text-slate-400"
																	: "text-slate-900 dark:text-slate-100"
															}`}
														>
															{notification.title}
														</p>
														<div className="flex items-center gap-2 flex-shrink-0">
															<time className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
																{getRelativeTime(notification.date)}
															</time>
															{!notification.read && (
																<span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
															)}
														</div>
													</div>
													<p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
														{notification.description}
													</p>
													{isClickable && !notification.read && (
														<p className="mt-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 group-hover:underline">
															Click to view →
														</p>
													)}
												</div>

												{/* Mark-as-read button */}
												{!notification.read && (
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															markAsRead(notification.id);
														}}
														className="flex-shrink-0 p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors dark:hover:text-cyan-400 dark:hover:bg-cyan-900/30"
														title="Mark as read"
													>
														<Check className="w-3.5 h-3.5" />
													</button>
												)}
											</div>
										);
									})}
								</div>
							</section>
						)}

						{/* Earlier group */}
						{earlierItems.length > 0 && (
							<section>
								<h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
									Earlier
								</h2>
								<div className="space-y-2">
									{earlierItems.map((notification) => {
										const { Icon, bg, icon } = getIconConfig(
											notification.type ?? "system",
										);
										const isClickable = !!notification.href;

										return (
											<div
												key={notification.id}
												role={isClickable ? "button" : undefined}
												tabIndex={isClickable ? 0 : undefined}
												onClick={
													isClickable
														? () => handleClick(notification.id, notification.href)
														: undefined
												}
												onKeyDown={
													isClickable
														? (e) => {
																if (e.key === "Enter" || e.key === " ") {
																	handleClick(notification.id, notification.href);
																}
														  }
														: undefined
												}
												className={[
													"group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
													notification.read
														? "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 opacity-70"
														: "bg-cyan-50/60 border-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-900/40 shadow-sm",
													isClickable
														? "cursor-pointer hover:shadow-md hover:-translate-y-px hover:border-cyan-200 dark:hover:border-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
														: "",
												]
													.filter(Boolean)
													.join(" ")}
											>
												{/* Icon */}
												<div
													className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${bg}`}
												>
													<Icon size={18} className={icon} />
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<p
															className={`text-sm font-semibold leading-snug ${
																notification.read
																	? "text-slate-600 dark:text-slate-400"
																	: "text-slate-900 dark:text-slate-100"
															}`}
														>
															{notification.title}
														</p>
														<div className="flex items-center gap-2 flex-shrink-0">
															<time className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
																{getRelativeTime(notification.date)}
															</time>
															{!notification.read && (
																<span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
															)}
														</div>
													</div>
													<p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
														{notification.description}
													</p>
													{isClickable && !notification.read && (
														<p className="mt-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 group-hover:underline">
															Click to view →
														</p>
													)}
												</div>

												{/* Mark-as-read button */}
												{!notification.read && (
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															markAsRead(notification.id);
														}}
														className="flex-shrink-0 p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors dark:hover:text-cyan-400 dark:hover:bg-cyan-900/30"
														title="Mark as read"
													>
														<Check className="w-3.5 h-3.5" />
													</button>
												)}
											</div>
										);
									})}
								</div>
							</section>
						)}
					</>
				)}
			</div>
		</div>
	);
}
