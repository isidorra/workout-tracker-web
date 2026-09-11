import { HttpErrorResponse } from "@angular/common/http";

/** Maps a failed workouts request to a translation key, keyed on the status code like auth errors. */
export function toWorkoutsErrorKey(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return "workoutsErrors.unexpected";
  }

  switch (error.status) {
    // No response at all, or a gateway in front of the API could not reach it.
    case 0:
    case 502:
    case 503:
    case 504:
      return "workoutsErrors.network";
    case 400:
      // The form mirrors the API's rules, so this only happens if the two drift apart.
      return "workoutsErrors.invalidRequest";
    case 401:
      // Only reaches here once the interceptor has failed to refresh the token.
      return "authErrors.sessionExpired";
    default:
      return "workoutsErrors.unexpected";
  }
}
