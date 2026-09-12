import { WorkoutType } from "../workouts/workouts-models";

export interface LastWorkoutSummary {
  id: string;
  type: WorkoutType;
  /** Wall-clock time as the user entered it, with no offset, e.g. "2026-09-11T18:30:00". */
  performedAt: string;
  durationMinutes: number;
}

export interface WeekStats {
  workoutCount: number;
  totalDurationMinutes: number;
  averageDifficulty: number | null;
  averageFatigue: number | null;
}

export interface DashboardSummary {
  today: string;
  weekStart: string;
  weekEnd: string;
  hasWorkoutToday: boolean;
  lastWorkout: LastWorkoutSummary | null;
  week: WeekStats;
}

/** Calendar month as the API expects it. `month` is 1–12. */
export interface ProgressMonth {
  year: number;
  month: number;
}

export interface ProgressWeek extends WeekStats {
  weekStart: string;
  weekEnd: string;
}

export interface DashboardProgress {
  year: number;
  month: number;
  weeks: ProgressWeek[];
}

export type DashboardStatus = "idle" | "loading" | "loaded" | "error";

/** What the dashboard page shows after the heading. */
export type DashboardView = "loading" | "error" | "ready";

/** Local calendar date as `YYYY-MM-DD`. Avoids `toISOString()`, which would shift the day in UTC. */
export function toLocalDateOnly(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function toLocalMonth(now = new Date()): ProgressMonth {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function shiftMonth(current: ProgressMonth, delta: number): ProgressMonth {
  const date = new Date(current.year, current.month - 1 + delta, 1);

  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function isCurrentOrFutureMonth(current: ProgressMonth, now = new Date()): boolean {
  const latest = toLocalMonth(now);

  return current.year > latest.year || (current.year === latest.year && current.month >= latest.month);
}

export function toMonthDate(current: ProgressMonth): string {
  return `${current.year}-${pad(current.month)}-01T00:00:00`;
}

/** Date-only API values parse as UTC; a wall-clock midnight keeps DatePipe on the same day. */
export function toLocalDateTime(dateOnly: string): string {
  return `${dateOnly}T00:00:00`;
}

export function weekDayFormatKey(
  weekStart: string,
  weekEnd: string,
): "weekDayFormat" | "weekDayFormatWithYear" {
  const year = String(new Date().getFullYear());

  return weekStart.startsWith(year) && weekEnd.startsWith(year)
    ? "weekDayFormat"
    : "weekDayFormatWithYear";
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}
