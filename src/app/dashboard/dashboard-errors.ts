import { HttpErrorResponse } from "@angular/common/http";

/** Maps a failed dashboard request to a translation key, keyed on the status code like auth errors. */
export function toDashboardErrorKey(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return "dashboardErrors.unexpected";
  }

  switch (error.status) {
    // No response at all, or a gateway in front of the API could not reach it.
    case 0:
    case 502:
    case 503:
    case 504:
      return "dashboardErrors.network";
    case 400:
      return "dashboardErrors.invalidRequest";
    case 401:
      // Only reaches here once the interceptor has failed to refresh the token.
      return "authErrors.sessionExpired";
    default:
      return "dashboardErrors.unexpected";
  }
}
