import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { AuthApiActions, AuthInterceptorActions } from "../auth/auth-actions";
import { WorkoutDialogActions, WorkoutsApiActions, WorkoutsPageActions } from "./workouts-actions";
import { Workout, WorkoutsStatus, WorkoutsView } from "./workouts-models";

export interface WorkoutsState {
  workouts: Workout[];
  status: WorkoutsStatus;
  /** Translation key of the last failed load; cleared once a new load starts. */
  errorKey: string | null;
  /** A create request is in flight. */
  pending: boolean;
}

export const initialWorkoutsState: WorkoutsState = {
  workouts: [],
  status: "idle",
  errorKey: null,
  pending: false,
};

export const workoutsFeature = createFeature({
  name: "workouts",
  reducer: createReducer(
    initialWorkoutsState,
    // The previous workouts stay while reloading, so revisiting the page does not flash a spinner.
    on(WorkoutsPageActions.opened, WorkoutsPageActions.retryClicked, (state): WorkoutsState => ({
      ...state,
      status: "loading",
      errorKey: null,
    })),
    on(WorkoutsApiActions.loadWorkoutsSuccess, (state, { workouts }): WorkoutsState => ({
      ...state,
      workouts,
      status: "loaded",
    })),
    on(WorkoutsApiActions.loadWorkoutsFailure, (state, { messageKey }): WorkoutsState => ({
      ...state,
      status: "error",
      errorKey: messageKey,
    })),
    on(WorkoutDialogActions.submitted, (state): WorkoutsState => ({ ...state, pending: true })),
    on(WorkoutsApiActions.createWorkoutSuccess, (state, { workout }): WorkoutsState => ({
      ...state,
      workouts: [...state.workouts, workout].sort(newestFirst),
      pending: false,
    })),
    on(WorkoutsApiActions.createWorkoutFailure, (state): WorkoutsState => ({
      ...state,
      pending: false,
    })),
    // The next account to sign in must never see this one's workouts.
    on(
      AuthApiActions.logoutSuccess,
      AuthInterceptorActions.sessionExpired,
      (): WorkoutsState => initialWorkoutsState,
    ),
  ),
  extraSelectors: ({ selectWorkouts, selectStatus }) => ({
    selectView: createSelector(selectWorkouts, selectStatus, (workouts, status): WorkoutsView => {
      if (workouts.length > 0) {
        return "list";
      }

      if (status === "loaded") {
        return "empty";
      }

      // "idle" only lasts until the page dispatches its first load, so it reads as loading.
      return status === "error" ? "error" : "loading";
    }),
  }),
});

/**
 * The API's order: latest `performedAt` first, then latest `createdAt`. Both are ISO 8601 strings,
 * so comparing them as text compares them in time.
 */
function newestFirst(a: Workout, b: Workout): number {
  return descending(a.performedAt, b.performedAt) || descending(a.createdAt, b.createdAt);
}

function descending(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  return a < b ? 1 : -1;
}
