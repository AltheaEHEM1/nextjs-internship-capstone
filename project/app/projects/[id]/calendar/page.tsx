"use client";

import { Calendar as BigCalendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { calendarLocalizer } from "@/hooks/project/useCalendar";
import { useCalendarStore } from "@/stores/project/calendar-store";

export default function Calendar() {
  const events = useCalendarStore(state => state.events);
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt("Enter new event title:");
    if (title) {
      const newEvent = { id: String(Date.now()), title, start, end };
      useCalendarStore.getState().addEvent(newEvent);
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
