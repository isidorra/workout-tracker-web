import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { DashboardProgress, DashboardSummary, ProgressMonth } from "./dashboard-models";

export const DashboardPageActions = createActionGroup({
  source: "Dashboard Page",
  events: {
    Opened: emptyProps(),
    "Retry Clicked": emptyProps(),
    "Progress Retry Clicked": emptyProps(),
    "Month Changed": props<ProgressMonth>(),
  },
});

/** Failures carry a translation key rather than the HTTP error, so actions stay serializable. */
export const DashboardApiActions = createActionGroup({
  source: "Dashboard API",
  events: {
    "Load Dashboard Success": props<{ dashboard: DashboardSummary }>(),
    "Load Dashboard Failure": props<{ messageKey: string }>(),
    "Load Progress Success": props<{ progress: DashboardProgress }>(),
    "Load Progress Failure": props<{ messageKey: string }>(),
  },
});
