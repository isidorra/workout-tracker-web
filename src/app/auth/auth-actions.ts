import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthSource, LoginRequest, RegisterRequest, User } from "./auth-models";

// Each group is named after where its events happen, so the DevTools log shows who dispatched what.

export const AppActions = createActionGroup({
  source: "App",
  events: {
    /** Dispatched once by the initializer in provide-auth.ts; kicks off the session restore. */
    Started: emptyProps(),
  },
});

export const LoginPageActions = createActionGroup({
  source: "Login Page",
  events: {
    Submitted: props<LoginRequest>(),
  },
});

export const RegisterPageActions = createActionGroup({
  source: "Register Page",
  events: {
    Submitted: props<RegisterRequest>(),
  },
});

export const UserMenuActions = createActionGroup({
  source: "User Menu",
  events: {
    "Logout Clicked": emptyProps(),
  },
});

/** Failures carry a translation key rather than the HTTP error, so actions stay serializable. */
export const AuthApiActions = createActionGroup({
  source: "Auth API",
  events: {
    /** `cookieRejected` is false when the API was unreachable, which says nothing about the cookie. */
    "Restore Session Failure": props<{ cookieRejected: boolean }>(),
    "Login Failure": props<{ messageKey: string }>(),
    "Register Failure": props<{ messageKey: string }>(),

    /** A token was obtained; shared by login, register and the startup restore. */
    Authenticated: props<{ accessToken: string; source: AuthSource }>(),
    "Load Current User Success": props<{ user: User; source: AuthSource }>(),
    "Load Current User Failure": props<{ messageKey: string }>(),

    "Logout Success": emptyProps(),
  },
});

/** Dispatched by TokenRefresh, which the interceptor calls when the API rejects an expired token. */
export const AuthInterceptorActions = createActionGroup({
  source: "Auth Interceptor",
  events: {
    /** An expired access token was swapped for a new one. */
    "Token Refreshed": props<{ accessToken: string }>(),
    /** The access token could not be refreshed. */
    "Session Expired": emptyProps(),
  },
});
