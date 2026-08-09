import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CalendarEvent } from "@/hooks/project/(tabs)/useCalendar";

export interface CalendarState {
    events: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
    addEvent: (event: CalendarEvent) => void;
}

export const useCalendarStore = create<CalendarState>()(
    devtools((set) => ({
        events: [],
        setEvents: (events) => set({ events }),
        addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    }))
);