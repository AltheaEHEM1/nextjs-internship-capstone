import { format, getDay, parse, startOfWeek } from "date-fns";
import { useState } from "react";
import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
	"en-US": require("date-fns/locale/en-US"),
};

export const calendarLocalizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

export type CalendarEvent = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
};

export function useCalendar() {
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

	return {
		events,
		handleSelectSlot,
		localizer: calendarLocalizer,
	};
}
