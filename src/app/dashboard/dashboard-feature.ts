import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { AuthApiActions, AuthInterceptorActions } from "../auth/auth-actions";
import { DashboardApiActions, DashboardPageActions } from "./dashboard-actions";
import {
  DashboardProgress,
  DashboardStatus,
  DashboardSummary,
  DashboardView,
  ProgressMonth,
  toLocalMonth,
} from "./dashboard-models";

export interface DashboardState {
  dashboard: DashboardSummary | null;
  status: DashboardStatus;
  /** Translation key of the last failed snapshot load; cleared once a new load starts. */
  errorKey: string | null;
  progress: DashboardProgress | null;
  progressMonth: ProgressMonth;
  progressStatus: DashboardStatus;
  /** Translation key of the last failed progress load; cleared once a new load starts. */
  progressErrorKey: string | null;
}

export const initialDashboardState: DashboardState = {
  dashboard: null,
  status: "idle",
  errorKey: null,
  progress: null,
  progressMonth: toLocalMonth(),
  progressStatus: "idle",
  progressErrorKey: null,
};

export const dashboardFeature = createFeature({
  name: "dashboard",
  reducer: createReducer(
    initialDashboardState,
    // Revisiting `/` always shows the current month. The previous snapshot stays so the page
    // does not flash a spinner; progress weeks are dropped because the month may have changed.
    on(DashboardPageActions.opened, (state): DashboardState => ({
      ...state,
      status: "loading",
      errorKey: null,
      progress: null,
      progressMonth: toLocalMonth(),
      progressStatus: "loading",
      progressErrorKey: null,
    })),
    on(DashboardPageActions.retryClicked, (state): DashboardState => ({
      ...state,
      status: "loading",
      errorKey: null,
      // Snapshot retry also recovers progress when that request never succeeded.
      ...(state.progress === null
        ? { progressStatus: "loading" as const, progressErrorKey: null }
        : {}),
    })),
    on(DashboardPageActions.progressRetryClicked, (state): DashboardState => ({
      ...state,
      progressStatus: "loading",
      progressErrorKey: null,
    })),
    // Drop the previous month's weeks so a fast prev/next cannot flash the wrong rows.
    on(DashboardPageActions.monthChanged, (state, { year, month }): DashboardState => ({
      ...state,
      progress: null,
      progressMonth: { year, month },
      progressStatus: "loading",
      progressErrorKey: null,
    })),
    on(DashboardApiActions.loadDashboardSuccess, (state, { dashboard }): DashboardState => ({
      ...state,
      dashboard,
      status: "loaded",
    })),
    on(DashboardApiActions.loadDashboardFailure, (state, { messageKey }): DashboardState => ({
      ...state,
      status: "error",
      errorKey: messageKey,
    })),
    on(DashboardApiActions.loadProgressSuccess, (state, { progress }): DashboardState => ({
      ...state,
      progress,
      progressStatus: "loaded",
    })),
    on(DashboardApiActions.loadProgressFailure, (state, { messageKey }): DashboardState => ({
      ...state,
      progressStatus: "error",
      progressErrorKey: messageKey,
    })),
    // The next account to sign in must never see this one's totals.
    on(
      AuthApiActions.logoutSuccess,
      AuthInterceptorActions.sessionExpired,
      (): DashboardState => initialDashboardState,
    ),
  ),
  extraSelectors: ({
    selectDashboard,
    selectStatus,
    selectProgress,
    selectProgressStatus,
  }) => ({
    selectView: createSelector(
      selectDashboard,
      selectStatus,
      (dashboard, status): DashboardView => {
        if (dashboard !== null && status === "loaded") {
          return "ready";
        }

        // "idle" only lasts until the page dispatches its first load, so it reads as loading.
        // Keep showing the last summary while a later load is in flight.
        if (dashboard !== null && status !== "error") {
          return "ready";
        }

        return status === "error" ? "error" : "loading";
      },
    ),
    selectProgressView: createSelector(
      selectProgress,
      selectProgressStatus,
      (progress, status): DashboardView => {
        if (progress !== null && status !== "error") {
          return "ready";
        }

        return status === "error" ? "error" : "loading";
      },
    ),
  }),
});
