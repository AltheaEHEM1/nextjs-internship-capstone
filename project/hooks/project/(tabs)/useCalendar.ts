import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
}

export const calendarLocalizer = momentLocalizer(moment);
