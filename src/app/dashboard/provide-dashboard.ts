import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import * as dashboardEffects from "./dashboard-effects";
import { dashboardFeature } from "./dashboard-feature";

/** Registers the dashboard store on first use; meant for the providers of the route that needs it. */
export function provideDashboard(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(dashboardFeature),
    provideEffects(dashboardEffects),
  ]);
}
