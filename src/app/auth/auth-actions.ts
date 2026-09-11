import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AuthSource, LoginRequest, RegisterRequest, User } from "./auth-models";

/** Failures carry a translation key rather than the HTTP error, so actions stay serializable. */
export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    "Restore Session": emptyProps(),
    /** `cookieRejected` is false when the API was unreachable, which says nothing about the cookie. */
    "Restore Session Failure": props<{ cookieRejected: boolean }>(),

    Login: props<LoginRequest>(),
    "Login Failure": props<{ messageKey: string }>(),
    Register: props<RegisterRequest>(),
    "Register Failure": props<{ messageKey: string }>(),

    /** A token was obtained; shared by login, register and the startup restore. */
    Authenticated: props<{ accessToken: string; source: AuthSource }>(),
    "Load Current User Success": props<{ user: User; source: AuthSource }>(),
    "Load Current User Failure": props<{ messageKey: string }>(),

    /** The interceptor swapped an expired access token for a new one. */
    "Token Refreshed": props<{ accessToken: string }>(),
    /** The interceptor could not refresh the access token. */
    "Session Expired": emptyProps(),

    Logout: emptyProps(),
    "Logout Success": emptyProps(),
  },
});
