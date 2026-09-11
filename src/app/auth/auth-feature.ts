import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { AuthActions } from "./auth-actions";
import { AuthStatus, User } from "./auth-models";

export interface AuthState {
  status: AuthStatus;
  /** Memory only; the HttpOnly refresh cookie is what survives a reload. */
  accessToken: string | null;
  /** Set together with `status: "authenticated"`, so signed-in views always have a user. */
  user: User | null;
  /** A login, register or logout request is in flight. */
  pending: boolean;
}

export const initialAuthState: AuthState = {
  status: "unknown",
  accessToken: null,
  user: null,
  pending: false,
};

const signedOut: AuthState = { ...initialAuthState, status: "anonymous" };

export const authFeature = createFeature({
  name: "auth",
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.login, AuthActions.register, AuthActions.logout, (state): AuthState => ({
      ...state,
      pending: true,
    })),
    on(AuthActions.loginFailure, AuthActions.registerFailure, (state): AuthState => ({
      ...state,
      pending: false,
    })),
    // The status stays put until /me answers, so the UI never shows a signed-in state without a user.
    on(
      AuthActions.authenticated,
      AuthActions.tokenRefreshed,
      (state, { accessToken }): AuthState => ({ ...state, accessToken }),
    ),
    on(AuthActions.loadCurrentUserSuccess, (state, { user }): AuthState => ({
      ...state,
      status: "authenticated",
      user,
      pending: false,
    })),
    on(
      AuthActions.restoreSessionFailure,
      AuthActions.loadCurrentUserFailure,
      AuthActions.sessionExpired,
      AuthActions.logoutSuccess,
      (): AuthState => signedOut,
    ),
  ),
  extraSelectors: ({ selectStatus }) => ({
    selectIsAuthenticated: createSelector(selectStatus, (status) => status === "authenticated"),
  }),
});
