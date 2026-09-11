import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { authFeature } from "./auth-feature";

/**
 * Keeps signed-in users off the login and register pages. Reading the state synchronously is safe
 * because bootstrap waits for the session restore.
 */
export const guestGuard: CanActivateFn = () => {
  const isAuthenticated = inject(Store).selectSignal(authFeature.selectIsAuthenticated);
  const router = inject(Router);

  return isAuthenticated() ? router.createUrlTree(["/"]) : true;
};
