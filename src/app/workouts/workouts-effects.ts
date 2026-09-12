import { inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom, mapResponse } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { exhaustMap, filter, switchMap, tap } from "rxjs";
import { Toast } from "../toast/toast";
import { WorkoutDialogActions, WorkoutsApiActions, WorkoutsPageActions } from "./workouts-actions";
import { WorkoutsApi } from "./workouts-api";
import { toWorkoutsErrorKey } from "./workouts-errors";
import { workoutsFeature } from "./workouts-feature";

export const loadWorkouts$ = createEffect(
  (actions$ = inject(Actions), api = inject(WorkoutsApi), store = inject(Store)) =>
    actions$.pipe(
      ofType(
        WorkoutsPageActions.opened,
        WorkoutsPageActions.retryClicked,
        WorkoutsPageActions.filterChanged,
        WorkoutsPageActions.pageChanged,
        WorkoutsApiActions.createWorkoutSuccess,
      ),
      concatLatestFrom(() => store.select(workoutsFeature.selectListQuery)),
      // Reopening the page while a load is in flight restarts it, so only the latest answer lands.
      switchMap(([, query]) =>
        api.list(query).pipe(
          mapResponse({
            next: (page) => WorkoutsApiActions.loadWorkoutsSuccess({ page }),
            error: (error: unknown) =>
              WorkoutsApiActions.loadWorkoutsFailure({ messageKey: toWorkoutsErrorKey(error) }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const createWorkout$ = createEffect(
  (actions$ = inject(Actions), api = inject(WorkoutsApi)) =>
    actions$.pipe(
      ofType(WorkoutDialogActions.submitted),
      // A second submit while one is in flight is dropped rather than saving the workout twice.
      exhaustMap(({ input }) =>
        api.create(input).pipe(
          mapResponse({
            next: (workout) => WorkoutsApiActions.createWorkoutSuccess({ workout }),
            error: (error: unknown) =>
              WorkoutsApiActions.createWorkoutFailure({ messageKey: toWorkoutsErrorKey(error) }),
          }),
        ),
      ),
    ),
  { functional: true },
);

// The dialog only dispatches; closing it here keeps it free of API outcomes, the way the auth
// effects navigate after a login. The list reloads from `createWorkoutSuccess` on page 1.
export const workoutSaved$ = createEffect(
  (actions$ = inject(Actions), dialog = inject(MatDialog), toast = inject(Toast)) =>
    actions$.pipe(
      ofType(WorkoutsApiActions.createWorkoutSuccess),
      tap(() => {
        dialog.closeAll();
        toast.show("workoutDialog.saved");
      }),
    ),
  { functional: true, dispatch: false },
);

export const notifyFailure$ = createEffect(
  (actions$ = inject(Actions), toast = inject(Toast)) =>
    actions$.pipe(
      ofType(WorkoutsApiActions.loadWorkoutsFailure, WorkoutsApiActions.createWorkoutFailure),
      // The auth effects already announce an expired session; a second toast would replace theirs.
      filter(({ messageKey }) => messageKey !== "authErrors.sessionExpired"),
      tap(({ messageKey }) => toast.show(messageKey)),
    ),
  { functional: true, dispatch: false },
);
