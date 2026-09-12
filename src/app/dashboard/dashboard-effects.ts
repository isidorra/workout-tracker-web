import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom, mapResponse } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { filter, map, merge, switchMap, tap } from "rxjs";
import { Toast } from "../toast/toast";
import { WorkoutsApiActions } from "../workouts/workouts-actions";
import { DashboardApiActions, DashboardPageActions } from "./dashboard-actions";
import { DashboardApi } from "./dashboard-api";
import { toDashboardErrorKey } from "./dashboard-errors";
import { toLocalDateOnly, toLocalMonth } from "./dashboard-models";
import { dashboardFeature } from "./dashboard-feature";

export const loadDashboard$ = createEffect(
  (actions$ = inject(Actions), api = inject(DashboardApi)) =>
    actions$.pipe(
      ofType(DashboardPageActions.opened, DashboardPageActions.retryClicked),
      // Reopening the page while a load is in flight restarts it, so only the latest answer lands.
      switchMap(() =>
        api.get(toLocalDateOnly()).pipe(
          mapResponse({
            next: (dashboard) => DashboardApiActions.loadDashboardSuccess({ dashboard }),
            error: (error: unknown) =>
              DashboardApiActions.loadDashboardFailure({
                messageKey: toDashboardErrorKey(error),
              }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const loadProgress$ = createEffect(
  (actions$ = inject(Actions), api = inject(DashboardApi), store = inject(Store)) =>
    merge(
      actions$.pipe(
        ofType(DashboardPageActions.opened),
        map(() => toLocalMonth()),
      ),
      actions$.pipe(
        ofType(DashboardPageActions.monthChanged),
        map(({ year, month }) => ({ year, month })),
      ),
      actions$.pipe(
        ofType(DashboardPageActions.progressRetryClicked),
        concatLatestFrom(() => store.select(dashboardFeature.selectProgressMonth)),
        map(([, month]) => month),
      ),
      actions$.pipe(
        ofType(DashboardPageActions.retryClicked),
        concatLatestFrom(() => store.select(dashboardFeature.selectProgress)),
        concatLatestFrom(() => store.select(dashboardFeature.selectProgressMonth)),
        filter(([[, progress]]) => progress === null),
        map(([, month]) => month),
      ),
    ).pipe(
      // A fast prev/next drops the in-flight month so only the latest weeks land.
      switchMap((month) =>
        api.getProgress(month).pipe(
          mapResponse({
            next: (progress) => DashboardApiActions.loadProgressSuccess({ progress }),
            error: (error: unknown) =>
              DashboardApiActions.loadProgressFailure({
                messageKey: toDashboardErrorKey(error),
              }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const refetchAfterCreate$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(WorkoutsApiActions.createWorkoutSuccess),
      map(() => DashboardPageActions.retryClicked()),
    ),
  { functional: true },
);

export const refetchProgressAfterCreate$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(WorkoutsApiActions.createWorkoutSuccess),
      map(() => DashboardPageActions.progressRetryClicked()),
    ),
  { functional: true },
);

export const notifyFailure$ = createEffect(
  (actions$ = inject(Actions), toast = inject(Toast)) =>
    actions$.pipe(
      ofType(DashboardApiActions.loadDashboardFailure, DashboardApiActions.loadProgressFailure),
      // The auth effects already announce an expired session; a second toast would replace theirs.
      filter(({ messageKey }) => messageKey !== "authErrors.sessionExpired"),
      tap(({ messageKey }) => toast.show(messageKey)),
    ),
  { functional: true, dispatch: false },
);
