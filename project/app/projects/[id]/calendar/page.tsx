"use client";

import { use, useCallback, useEffect, useState } from "react";
import { Calendar as BigCalendar } from "react-big-calendar";

import { pusherClient } from "@/lib/real-time-board/PusherClient";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { calendarLocalizer } from "@/hooks/project/(tabs)/useCalendar";
import { useCalendarStore } from "@/stores/project/(tabs)/CalendarStore";

export default function Calendar({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const events = useCalendarStore((state) => state.events);
	const setEvents = useCalendarStore((state) => state.setEvents);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState<{
		start: Date;
		end: Date;
	} | null>(null);
	const [eventTitle, setEventTitle] = useState("");

	const fetchProjectData = useCallback(() => {
		fetch(`/api/project/${id}`)
			.then((r) => r.json())
			.then((res) => {
				if (res.success && res.data?.statuses && res.data.statuses.length > 0) {
					const allEvents = res.data.statuses.flatMap(
						(s: {
							tasks?: {
								id: string;
								title?: string;
								dueDate?: string | null;
								createdAt: string;
							}[];
						}) =>
							(s.tasks || [])
								.filter((t) => t.dueDate || t.createdAt) // Ensure there's a date
								.map((t) => {
									const start = t.createdAt
										? new Date(t.createdAt)
										: new Date(t.dueDate || "");
									const end = t.dueDate ? new Date(t.dueDate) : start;
									return {
										id: t.id,
										title: t.title || "Untitled Task",
										start,
										end,
									};
								}),
					);

					setEvents(allEvents);
				}
			});
	}, [id, setEvents]);

	useEffect(() => {
		fetchProjectData();
	}, [fetchProjectData]);

	useEffect(() => {
		if (!id || !pusherClient) return;
		const channelName = `project-${id}`;
		const channel = pusherClient.subscribe(channelName);

		channel.bind("task-updated", () => {
			fetchProjectData();
		});

		return () => {
			pusherClient?.unsubscribe(channelName);
		};
	}, [id, fetchProjectData]);
	const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
		setSelectedSlot({ start, end });
		setEventTitle("");
		setIsModalOpen(true);
	};
	const handleSaveEvent = () => {
		if (eventTitle.trim() && selectedSlot) {
			const newEvent = {
				id: String(Date.now()),
				title: eventTitle,
				start: selectedSlot.start,
				end: selectedSlot.end,
			};
			useCalendarStore.getState().addEvent(newEvent);
			setIsModalOpen(false);
		}
	};
	const localizer = calendarLocalizer;

	return (
		<div className="space-y-4 pb-12">
			{/* Header Info */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
						Project Calendar & Schedules
					</h2>
					<p className="text-sm text-outer_space-500 dark:text-platinum-400">
						Click and drag across time slots or days to instantly schedule
						project milestones.
					</p>
				</div>
			</div>

			{/* Calendar Wrapper Box */}
			<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-100">
				<style jsx global>{`
          /* Custom overrides matching your design tokens */
          .rbc-calendar {
            font-family: inherit;
          }
          .rbc-header {
            padding: 12px 0;
            font-weight: 600;
            font-size: 0.875rem;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
          }
          .dark .rbc-header {
            border-color: #334155;
            color: #94a3b8;
          }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            background-color: #ffffff;
          }
          .dark .rbc-month-view, .dark .rbc-time-view, .dark .rbc-agenda-view {
            border-color: #334155;
            background-color: #1e293b;
          }
          .rbc-day-bg {
            transition: background-color 0.2s ease;
          }
          .rbc-day-bg:hover {
            background-color: #f8fafc;
          }
          .dark .rbc-day-bg:hover {
            background-color: #334155;
          }
          .rbc-month-row, .rbc-day-bg + .rbc-day-bg, .rbc-header + .rbc-header {
            border-color: #e2e8f0;
          }
          .dark .rbc-month-row, .dark .rbc-day-bg + .rbc-day-bg, .dark .rbc-header + .rbc-header {
            border-color: #334155;
          }
          .rbc-off-range-bg {
            background: #f1f5f9;
          }
          .dark .rbc-off-range-bg {
            background: #0f172a;
          }
          .rbc-today {
            background-color: rgba(14, 165, 233, 0.04) !important;
          }
          .rbc-event {
            background-color: #0ea5e9;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 0.75rem;
            font-weight: 500;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.1s ease, box-shadow 0.1s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rbc-event:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .rbc-toolbar button {
            color: #475569;
            border: 1px solid #e2e8f0;
            background-color: #ffffff;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .rbc-toolbar button:hover {
            background-color: #f8fafc;
            border-color: #cbd5e1;
            color: #0f172a;
          }
          .dark .rbc-toolbar button {
            background-color: #1e293b;
            border-color: #334155;
            color: #cbd5e1;
          }
          .dark .rbc-toolbar button:hover {
            background-color: #334155;
            border-color: #475569;
            color: #f1f5f9;
          }
          .rbc-toolbar button.rbc-active {
            background-color: #0ea5e9;
            color: white;
            border-color: #0ea5e9;
            box-shadow: 0 1px 3px rgba(14, 165, 233, 0.4);
          }
          .dark .rbc-toolbar button.rbc-active {
            background-color: #0ea5e9;
            color: white;
            border-color: #0ea5e9;
          }
        `}</style>

				<div style={{ height: 650 }}>
					<BigCalendar
						localizer={localizer}
						events={events}
						startAccessor="start"
						endAccessor="end"
						selectable
						onSelectSlot={handleSelectSlot}
						views={["month", "week", "day", "agenda"]}
						defaultView="month"
					/>
				</div>
			</div>

			{/* Modal for adding events */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
						<h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-platinum-100">
							Add New Event
						</h3>
						<input
							type="text"
							placeholder="Event Title..."
							value={eventTitle}
							onChange={(e) => setEventTitle(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSaveEvent();
							}}
							className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none transition-colors focus:border-blue_munsell-500 focus:ring-1 focus:ring-blue_munsell-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-white dark:focus:border-blue_munsell-400"
						/>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSaveEvent}
								className="rounded-lg bg-blue_munsell-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue_munsell-600 shadow-sm"
							>
								Save Event
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
