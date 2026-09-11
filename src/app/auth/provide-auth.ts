import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from "@angular/core";
import { provideEffects } from "@ngrx/effects";
import { Store, provideState } from "@ngrx/store";
import { filter, firstValueFrom, of, timeout } from "rxjs";
import { AppActions } from "./auth-actions";
import * as authEffects from "./auth-effects";
import { authFeature } from "./auth-feature";

/** How long startup waits for the session before rendering signed out. */
const RESTORE_TIMEOUT_MS = 10_000;

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(authFeature),
    provideEffects(authEffects),
    // Holds bootstrap until the session is restored or known to be absent, so the navbar never
    // flashes Login and Register before switching to the avatar.
    provideAppInitializer(() => {
      const store = inject(Store);

      // Subscribe before dispatching: without a session hint, the status settles synchronously.
      const settled = firstValueFrom(
        store.select(authFeature.selectStatus).pipe(
          filter((status) => status !== "unknown"),
          // A hung API should degrade to a signed-out start, not a blank page.
          timeout({ first: RESTORE_TIMEOUT_MS, with: () => of(null) }),
        ),
      );

      store.dispatch(AppActions.started());

      return settled;
    }),
  ]);
}
