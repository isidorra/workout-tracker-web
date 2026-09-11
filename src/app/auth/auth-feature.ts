import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import {
  AuthApiActions,
  AuthInterceptorActions,
  LoginPageActions,
  RegisterPageActions,
  UserMenuActions,
} from "./auth-actions";
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
    on(
      LoginPageActions.submitted,
      RegisterPageActions.submitted,
      UserMenuActions.logoutClicked,
      (state): AuthState => ({ ...state, pending: true }),
    ),
    on(AuthApiActions.loginFailure, AuthApiActions.registerFailure, (state): AuthState => ({
      ...state,
      pending: false,
    })),
    // The status stays put until /me answers, so the UI never shows a signed-in state without a user.
    on(
      AuthApiActions.authenticated,
      AuthInterceptorActions.tokenRefreshed,
      (state, { accessToken }): AuthState => ({ ...state, accessToken }),
    ),
    on(AuthApiActions.loadCurrentUserSuccess, (state, { user }): AuthState => ({
      ...state,
      status: "authenticated",
      user,
      pending: false,
    })),
    on(
      AuthApiActions.restoreSessionFailure,
      AuthApiActions.loadCurrentUserFailure,
      AuthInterceptorActions.sessionExpired,
      AuthApiActions.logoutSuccess,
      (): AuthState => signedOut,
    ),
  ),
  extraSelectors: ({ selectStatus }) => ({
    selectIsAuthenticated: createSelector(selectStatus, (status) => status === "authenticated"),
  }),
});
