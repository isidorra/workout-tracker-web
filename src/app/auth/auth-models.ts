export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** RFC 7807 body the API returns for handled errors. Validation failures add `errors`. */
export interface ProblemDetails {
  status?: number;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  return typeof value === "object" && value !== null && "status" in value;
}

/** "unknown" only lasts until the session restore at bootstrap settles. */
export type AuthStatus = "unknown" | "anonymous" | "authenticated";

/** How the access token was obtained; decides whether to navigate once the user is loaded. */
export type AuthSource = "login" | "register" | "restore";
