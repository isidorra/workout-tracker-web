// The API sends the type as a number, so the values must match its WorkoutType enum.
export const WorkoutType = {
  Cardio: 1,
  Strength: 2,
  Flexibility: 3,
  Mixed: 4,
} as const;

export type WorkoutType = (typeof WorkoutType)[keyof typeof WorkoutType];

/** The order types are offered in. */
export const WORKOUT_TYPES: readonly WorkoutType[] = [
  WorkoutType.Cardio,
  WorkoutType.Strength,
  WorkoutType.Flexibility,
  WorkoutType.Mixed,
];

/** Sub-key of each type under the `workoutType` translation block. */
export const WORKOUT_TYPE_KEYS: Record<WorkoutType, string> = {
  [WorkoutType.Cardio]: "cardio",
  [WorkoutType.Strength]: "strength",
  [WorkoutType.Flexibility]: "flexibility",
  [WorkoutType.Mixed]: "mixed",
};

// Mirror the API's WorkoutPolicy; difficulty and fatigue are rated on this scale.
export const RATING_MIN = 1;
export const RATING_MAX = 10;

/** Matches `WorkoutPolicy.DefaultPageSize` so the client never has to guess the page length. */
export const WORKOUTS_PAGE_SIZE = 20;

/** Query for one page of the signed-in user's workouts. `type` is null for every type. */
export interface WorkoutsListQuery {
  type: WorkoutType | null;
  page: number;
  pageSize: number;
}

export interface Workout {
  id: string;
  type: WorkoutType;
  /** Wall-clock time as the user entered it, with no offset, e.g. "2026-09-11T18:30:00". */
  performedAt: string;
  durationMinutes: number;
  calories: number;
  difficulty: number;
  fatigue: number;
  /** The API stores blank notes as null. */
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Body of a create request. */
export interface WorkoutInput {
  type: WorkoutType;
  /** Wall-clock time without an offset, e.g. "2026-09-11T18:30:00"; the API rejects "Z". */
  performedAt: string;
  durationMinutes: number;
  calories: number;
  difficulty: number;
  fatigue: number;
  notes: string | null;
}

/**
 * What the workout form edits. Numbers are null while their input is empty, which is what a native
 * number input reports; date and time stay the strings the native inputs produce.
 */
export interface WorkoutFormModel {
  type: WorkoutType | null;
  date: string;
  time: string;
  durationMinutes: number | null;
  calories: number | null;
  difficulty: number | null;
  fatigue: number | null;
  notes: string;
}

/** An empty form dated now. Formatted by hand, since toISOString() would give the UTC date. */
export function initialWorkoutFormModel(now = new Date()): WorkoutFormModel {
  return {
    type: null,
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    durationMinutes: null,
    calories: null,
    difficulty: null,
    fatigue: null,
    notes: "",
  };
}

/** The request for a form that passed `workoutSchema`, whose required fields are all filled. */
export function toWorkoutInput(model: WorkoutFormModel): WorkoutInput {
  const { type, durationMinutes, calories, difficulty, fatigue } = model;

  if (
    type === null ||
    durationMinutes === null ||
    calories === null ||
    difficulty === null ||
    fatigue === null
  ) {
    throw new Error("Only a workout form that passed validation can become a request.");
  }

  return {
    type,
    // Time inputs give "HH:mm", or "HH:mm:ss" if a browser shows seconds; either way the minute
    // is what counts, and the string never gains an offset.
    performedAt: `${model.date}T${model.time.slice(0, 5)}:00`,
    durationMinutes,
    calories,
    difficulty,
    fatigue,
    notes: model.notes.trim() || null,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export type WorkoutsStatus = "idle" | "loading" | "loaded" | "error";

/** What the workouts page shows, derived from the status, filter, and whether any workouts are held. */
export type WorkoutsView = "loading" | "error" | "empty" | "filterEmpty" | "list";
