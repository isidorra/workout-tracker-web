import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { AuthApiActions, AuthInterceptorActions } from "../auth/auth-actions";
import { WorkoutDialogActions, WorkoutsApiActions, WorkoutsPageActions } from "./workouts-actions";
import {
  WORKOUTS_PAGE_SIZE,
  Workout,
  WorkoutType,
  WorkoutsListQuery,
  WorkoutsStatus,
  WorkoutsView,
} from "./workouts-models";

export interface WorkoutsState {
  workouts: Workout[];
  /** Null means every type. */
  type: WorkoutType | null;
  page: number;
  pageSize: number;
  totalCount: number;
  status: WorkoutsStatus;
  /** Translation key of the last failed load; cleared once a new load starts. */
  errorKey: string | null;
  /** A create request is in flight. */
  pending: boolean;
}

export const initialWorkoutsState: WorkoutsState = {
  workouts: [],
  type: null,
  page: 1,
  pageSize: WORKOUTS_PAGE_SIZE,
  totalCount: 0,
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
    on(WorkoutsPageActions.filterChanged, (state, { filterType }): WorkoutsState => ({
      ...state,
      type: filterType,
      page: 1,
      status: "loading",
      errorKey: null,
    })),
    on(WorkoutsPageActions.pageChanged, (state, { page }): WorkoutsState => ({
      ...state,
      page,
      status: "loading",
      errorKey: null,
    })),
    on(WorkoutsApiActions.loadWorkoutsSuccess, (state, { page }): WorkoutsState => ({
      ...state,
      workouts: page.items,
      page: page.page,
      pageSize: page.pageSize,
      totalCount: page.totalCount,
      status: "loaded",
    })),
    on(WorkoutsApiActions.loadWorkoutsFailure, (state, { messageKey }): WorkoutsState => ({
      ...state,
      status: "error",
      errorKey: messageKey,
    })),
    on(WorkoutDialogActions.submitted, (state): WorkoutsState => ({ ...state, pending: true })),
    on(WorkoutsApiActions.createWorkoutSuccess, (state): WorkoutsState => ({
      ...state,
      pending: false,
      page: 1,
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
  extraSelectors: ({
    selectWorkouts,
    selectStatus,
    selectType,
    selectPage,
    selectPageSize,
    selectTotalCount,
  }) => ({
    selectView: createSelector(
      selectWorkouts,
      selectStatus,
      selectType,
      selectTotalCount,
      (workouts, status, type, totalCount): WorkoutsView => {
        if (workouts.length > 0) {
          return "list";
        }

        if (status === "loaded") {
          if (type !== null) {
            return "filterEmpty";
          }

          if (totalCount === 0) {
            return "empty";
          }
        }

        // "idle" only lasts until the page dispatches its first load, so it reads as loading.
        return status === "error" ? "error" : "loading";
      },
    ),
    selectListQuery: createSelector(
      selectType,
      selectPage,
      selectPageSize,
      (type, page, pageSize): WorkoutsListQuery => ({ type, page, pageSize }),
    ),
    selectPageCount: createSelector(selectTotalCount, selectPageSize, (totalCount, pageSize) =>
      pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0,
    ),
  }),
});
