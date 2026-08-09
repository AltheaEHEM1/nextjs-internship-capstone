import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
import { useCalendarStore } from "@/stores/project/(tabs)/CalendarStore";

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

export const calendarLocalizer = momentLocalizer(moment);

export function useCalendar() {
    const events = useCalendarStore((state) => state.events);
    const addEvent = useCalendarStore((state) => state.addEvent);
    const setEvents = useCalendarStore((state) => state.setEvents);

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        const title = window.prompt("Enter new event title:");
        if (title) {
            const newEvent: CalendarEvent = {
                id: String(Date.now()),
                title,
                start,
                end,
            };
            addEvent(newEvent);
        }
    };

    return {
        events,
        localizer: calendarLocalizer,
        handleSelectSlot,
        setEvents,
        addEvent,
    };
}