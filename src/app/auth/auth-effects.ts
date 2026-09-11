import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mapResponse } from "@ngrx/operators";
import { exhaustMap, filter, merge, of, switchMap, tap } from "rxjs";
import { Toast } from "../toast/toast";
import {
  AppActions,
  AuthApiActions,
  AuthInterceptorActions,
  LoginPageActions,
  RegisterPageActions,
  UserMenuActions,
} from "./auth-actions";
import { AuthApi } from "./auth-api";
import { toAuthErrorKey } from "./auth-errors";
import { SessionHint } from "./session-hint";

// Every request is wrapped in mapResponse: an error escaping an effect would end its stream, and a
// dead restoreSession$ would leave the startup initializer waiting for a status that never comes.

export const restoreSession$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi), hint = inject(SessionHint)) =>
    actions$.pipe(
      ofType(AppActions.started),
      exhaustMap(() =>
        // A browser that never signed in has no cookie to refresh with, so skip the request.
        hint.has()
          ? api.refresh().pipe(
              mapResponse({
                next: ({ accessToken }) =>
                  AuthApiActions.authenticated({ accessToken, source: "restore" }),
                error: (error: unknown) =>
                  AuthApiActions.restoreSessionFailure({
                    cookieRejected: error instanceof HttpErrorResponse && error.status === 401,
                  }),
              }),
            )
          : of(AuthApiActions.restoreSessionFailure({ cookieRejected: false })),
      ),
    ),
  { functional: true },
);

export const login$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(LoginPageActions.submitted),
      exhaustMap(({ email, password }) =>
        api.login({ email, password }).pipe(
          mapResponse({
            next: ({ accessToken }) =>
              AuthApiActions.authenticated({ accessToken, source: "login" }),
            error: (error: unknown) =>
              AuthApiActions.loginFailure({ messageKey: toAuthErrorKey(error, "login") }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const register$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(RegisterPageActions.submitted),
      exhaustMap(({ name, email, password }) =>
        api.register({ name, email, password }).pipe(
          mapResponse({
            next: ({ accessToken }) =>
              AuthApiActions.authenticated({ accessToken, source: "register" }),
            error: (error: unknown) =>
              AuthApiActions.registerFailure({ messageKey: toAuthErrorKey(error, "register") }),
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
      ofType(AuthApiActions.authenticated),
      switchMap(({ source }) =>
        api.me().pipe(
          mapResponse({
            next: (user) => AuthApiActions.loadCurrentUserSuccess({ user, source }),
            error: (error: unknown) =>
              AuthApiActions.loadCurrentUserFailure({ messageKey: toAuthErrorKey(error, "me") }),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const logout$ = createEffect(
  (actions$ = inject(Actions), api = inject(AuthApi)) =>
    actions$.pipe(
      ofType(UserMenuActions.logoutClicked),
      exhaustMap(() =>
        api.logout().pipe(
          // The cookie is HttpOnly, so if the request fails, clearing local state is all we can do.
          mapResponse({
            next: () => AuthApiActions.logoutSuccess(),
            error: () => AuthApiActions.logoutSuccess(),
          }),
        ),
      ),
    ),
  { functional: true },
);

export const sessionEstablished$ = createEffect(
  (actions$ = inject(Actions), hint = inject(SessionHint), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthApiActions.loadCurrentUserSuccess),
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
          AuthApiActions.loadCurrentUserFailure,
          AuthInterceptorActions.sessionExpired,
          AuthApiActions.logoutSuccess,
        ),
      ),
      // An unreachable API at startup says nothing about the cookie, so the hint survives it.
      actions$.pipe(
        ofType(AuthApiActions.restoreSessionFailure),
        filter(({ cookieRejected }) => cookieRejected),
      ),
    ).pipe(tap(() => hint.clear())),
  { functional: true, dispatch: false },
);

export const navigateAfterSignOut$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    merge(
      actions$.pipe(
        ofType(AuthApiActions.logoutSuccess),
        tap(() => void router.navigateByUrl("/")),
      ),
      actions$.pipe(
        ofType(AuthInterceptorActions.sessionExpired),
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
          AuthApiActions.loginFailure,
          AuthApiActions.registerFailure,
          AuthApiActions.loadCurrentUserFailure,
        ),
        tap(({ messageKey }) => toast.show(messageKey)),
      ),
      actions$.pipe(
        ofType(AuthInterceptorActions.sessionExpired),
        tap(() => toast.show("authErrors.sessionExpired")),
      ),
    ),
  { functional: true, dispatch: false },
);
