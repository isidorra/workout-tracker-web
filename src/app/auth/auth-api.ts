import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { AccessTokenResponse, LoginRequest, RegisterRequest, User } from "./auth-models";

export const API_PREFIX = "/api/";

/** Endpoints that authenticate with the refresh-token cookie rather than the bearer token. */
export const COOKIE_AUTH_URLS: ReadonlySet<string> = new Set([
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
]);

@Injectable({ providedIn: "root" })
export class AuthApi {
  private readonly http = inject(HttpClient);

  // `withCredentials` is a no-op while the dev proxy keeps the API same-origin, but it is what lets
  // the HttpOnly refresh cookie travel if the API is ever served from another origin.
  register(body: RegisterRequest): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>("/api/auth/register", body, {
      withCredentials: true,
    });
  }

  login(body: LoginRequest): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>("/api/auth/login", body, { withCredentials: true });
  }

  refresh(): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>("/api/auth/refresh", null, {
      withCredentials: true,
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>("/api/auth/logout", null, { withCredentials: true });
  }

  me(): Observable<User> {
    return this.http.get<User>("/api/auth/me");
  }
}
