import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { authFeature } from "./auth-feature";

/**
 * Keeps signed-out visitors off pages that need an account. Reading the state synchronously is safe
 * because bootstrap waits for the session restore.
 */
export const authGuard: CanActivateFn = () => {
  const isAuthenticated = inject(Store).selectSignal(authFeature.selectIsAuthenticated);
  const router = inject(Router);

  return isAuthenticated() ? true : router.createUrlTree(["/login"]);
};
