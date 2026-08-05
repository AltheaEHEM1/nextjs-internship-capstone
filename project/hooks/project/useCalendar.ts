// src/hooks/project/useCalendar.ts
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

/**
 * Provides a localizer compatible with react‑big‑calendar.
 * This minimal implementation can be replaced with custom locale logic.
 */
export const calendarLocalizer = momentLocalizer(moment);
