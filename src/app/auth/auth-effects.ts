import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mapResponse } from "@ngrx/operators";
import { exhaustMap, filter, merge, of, switchMap, tap } from "rxjs";
import { Toast } from "../toast/toast";
import { AuthActions } from "./auth-actions";
import { AuthApi } from "./auth-api";
import { toAuthErrorKey } from "./auth-errors";
import { SessionHint } from "./session-hint";

// Every request is wrapped in mapResponse: an error escaping an effect would end its stream, and a
// dead restoreSession$ would leave the startup initializer waiting for a status that never comes.

export const restoreSession$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi), hint = inject(SessionHint)) =>
    actions$.pipe(
      ofType(AuthActions.restoreSession),
      exhaustMap(() =>
        // A browser that never signed in has no cookie to refresh with, so skip the request.
        hint.has()
          ? api.refresh().pipe(
              mapResponse({
                next: ({ accessToken }) =>
                  AuthActions.authenticated({ accessToken, source: "restore" }),
                error: (error: unknown) =>
                  AuthActions.restoreSessionFailure({
                    cookieRejected: error instanceof HttpErrorResponse && error.status === 401,
                  }),
              }),
            )
          : of(AuthActions.restoreSessionFailure({ cookieRejected: false })),
      ),
    ),
  { functional: true },
);

export const login$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        api.login({ email, password }).pipe(
          mapResponse({
            next: ({ accessToken }) => AuthActions.authenticated({ accessToken, source: "login" }),
            error: (error: unknown) =>
              AuthActions.loginFailure({ messageKey: toAuthErrorKey(error, "login") }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const register$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ name, email, password }) =>
        api.register({ name, email, password }).pipe(
          mapResponse({
            next: ({ accessToken }) =>
              AuthActions.authenticated({ accessToken, source: "register" }),
            error: (error: unknown) =>
              AuthActions.registerFailure({ messageKey: toAuthErrorKey(error, "register") }),
          }),
        ),
      ),
    ),
  { functional: true },
);

// Reducers run before effects see an action, so the interceptor already has the new token here.
export const loadCurrentUser$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(AuthActions.authenticated),
      switchMap(({ source }) =>
        api.me().pipe(
          mapResponse({
            next: (user) => AuthActions.loadCurrentUserSuccess({ user, source }),
            error: (error: unknown) =>
              AuthActions.loadCurrentUserFailure({ messageKey: toAuthErrorKey(error, "me") }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const logout$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        api.logout().pipe(
          // The cookie is HttpOnly, so if the request fails, clearing local state is all we can do.
          mapResponse({
            next: () => AuthActions.logoutSuccess(),
            error: () => AuthActions.logoutSuccess(),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const sessionEstablished$ = createEffect(
  (actions$ = inject(Actions), hint = inject(SessionHint), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loadCurrentUserSuccess),
      tap(({ source }) => {
        hint.set();

        // A restore at startup must leave the user on the page they opened.
        if (source !== "restore") {
          void router.navigateByUrl("/");
        }
      }),
    ),
  { functional: true, dispatch: false },
);

export const clearSessionHint$ = createEffect(
  (actions$ = inject(Actions), hint = inject(SessionHint)) =>
    merge(
      actions$.pipe(
        ofType(
          AuthActions.loadCurrentUserFailure,
          AuthActions.sessionExpired,
          AuthActions.logoutSuccess,
        ),
      ),
      // An unreachable API at startup says nothing about the cookie, so the hint survives it.
      actions$.pipe(
        ofType(AuthActions.restoreSessionFailure),
        filter(({ cookieRejected }) => cookieRejected),
      ),
    ).pipe(tap(() => hint.clear())),
  { functional: true, dispatch: false },
);

export const navigateAfterSignOut$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    merge(
      actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => void router.navigateByUrl("/")),
      ),
      actions$.pipe(
        ofType(AuthActions.sessionExpired),
        tap(() => void router.navigateByUrl("/login")),
      ),
    ),
  { functional: true, dispatch: false },
);

export const notifyFailure$ = createEffect(
  (actions$ = inject(Actions), toast = inject(Toast)) =>
    merge(
      actions$.pipe(
        ofType(
          AuthActions.loginFailure,
          AuthActions.registerFailure,
          AuthActions.loadCurrentUserFailure,
        ),
        tap(({ messageKey }) => toast.show(messageKey)),
      ),
      actions$.pipe(
        ofType(AuthActions.sessionExpired),
        tap(() => toast.show("authErrors.sessionExpired")),
      ),
    ),
  { functional: true, dispatch: false },
);
