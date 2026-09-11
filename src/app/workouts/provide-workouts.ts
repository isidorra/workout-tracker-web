import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import * as workoutsEffects from "./workouts-effects";
import { workoutsFeature } from "./workouts-feature";

/** Registers the workouts store on first use; meant for the providers of the route that needs it. */
export function provideWorkouts(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState(workoutsFeature), provideEffects(workoutsEffects)]);
}
