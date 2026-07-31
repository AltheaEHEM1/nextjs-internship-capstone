"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import React, { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
	"en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

type CalendarEvent = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
};

export default function Calendar() {
	const [events, setEvents] = useState<CalendarEvent[]>([
		{
			id: "1",
			title: "Design System Refactor Deadline",
			start: new Date(2026, 7, 15, 9, 0),
			end: new Date(2026, 7, 15, 17, 0),
		},
		{
			id: "2",
			title: "Sprint Planning & Backlog Review",
			start: new Date(2026, 7, 18, 10, 0),
			end: new Date(2026, 7, 18, 12, 0),
		},
		{
			id: "3",
			title: "Client Progress Presentation",
			start: new Date(2026, 7, 22, 14, 0),
			end: new Date(2026, 7, 22, 15, 30),
		},
	]);

	// Handle slot selection to add an event interactively
	const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
		const title = window.prompt("Enter new event title:");
		if (title) {
			const newEvent: CalendarEvent = {
				id: String(Date.now()),
				title,
				start,
				end,
			};
			setEvents((prev) => [...prev, newEvent]);
		}
	};

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
            padding: 10px 0;
            font-weight: 600;
            font-size: 0.875rem;
            border-bottom: 1px solid #cbd5e1;
          }
          .dark .rbc-header {
            border-color: #334155;
            color: #f1f5f9;
          }
          .rbc-off-range-bg {
            background: #f8fafc;
          }
          .dark .rbc-off-range-bg {
            background: #0f172a;
          }
          .rbc-today {
            background-color: rgba(14, 165, 233, 0.08) !important;
          }
          .rbc-event {
            background-color: #0ea5e9;
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 0.75rem;
          }
          .rbc-toolbar button {
            color: inherit;
            border: 1px solid #cbd5e1;
            background-color: transparent;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .rbc-toolbar button:hover {
            background-color: #f1f5f9;
          }
          .dark .rbc-toolbar button {
            border-color: #334155;
            color: #f1f5f9;
          }
          .dark .rbc-toolbar button:hover {
            background-color: #334155;
          }
          .rbc-toolbar button.rbc-active {
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
		</div>
	);
}
