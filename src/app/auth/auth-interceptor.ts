import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, of, switchMap, throwError } from "rxjs";
import { API_PREFIX, COOKIE_AUTH_URLS } from "./auth-api";
import { authFeature } from "./auth-feature";
import { TokenRefresh } from "./token-refresh";

/**
 * Sends the access token with API requests. When the API rejects it as expired, refreshes it once
 * and replays the request.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // The cookie endpoints authenticate with the refresh cookie, and a 401 from them means bad
  // credentials or no session, never "retry with a fresh token".
  if (!req.url.startsWith(API_PREFIX) || COOKIE_AUTH_URLS.has(req.url)) {
    return next(req);
  }

  const accessToken = inject(Store).selectSignal(authFeature.selectAccessToken);
  const tokenRefresh = inject(TokenRefresh);
  const sentToken = accessToken();

  // Signed out: there is nothing to attach and no session to refresh.
  if (!sentToken) {
    return next(req);
  }

  return next(withBearer(req, sentToken)).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      // Another request may have refreshed the token while this one was in flight.
      const currentToken = accessToken();
      const freshToken$ =
        currentToken && currentToken !== sentToken ? of(currentToken) : tokenRefresh.refresh();

      // The replay goes to `next`, past this interceptor, so a second 401 cannot loop.
      return freshToken$.pipe(switchMap((token) => next(withBearer(req, token))));
    }),
  );
};

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
