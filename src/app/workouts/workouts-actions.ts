import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Paged } from "../shared/paged";
import { Workout, WorkoutInput, WorkoutType } from "./workouts-models";

export const WorkoutsPageActions = createActionGroup({
  source: "Workouts Page",
  events: {
    Opened: emptyProps(),
    "Retry Clicked": emptyProps(),
    // Wrapped; a top-level `type` would clash with the action's own type field.
    "Filter Changed": props<{ filterType: WorkoutType | null }>(),
    "Page Changed": props<{ page: number }>(),
  },
});

export const WorkoutDialogActions = createActionGroup({
  source: "Workout Dialog",
  events: {
    // Wrapped, because the input's own `type` would clash with the action's.
    Submitted: props<{ input: WorkoutInput }>(),
  },
});

/** Failures carry a translation key rather than the HTTP error, so actions stay serializable. */
export const WorkoutsApiActions = createActionGroup({
  source: "Workouts API",
  events: {
    "Load Workouts Success": props<{ page: Paged<Workout> }>(),
    "Load Workouts Failure": props<{ messageKey: string }>(),

    "Create Workout Success": props<{ workout: Workout }>(),
    "Create Workout Failure": props<{ messageKey: string }>(),
  },
});
