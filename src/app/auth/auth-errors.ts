import { HttpErrorResponse } from "@angular/common/http";
import { isProblemDetails } from "./auth-models";

export type AuthOperation = "login" | "register" | "me";

const FIELD_ERROR_KEYS: ReadonlyMap<string, string> = new Map([
  ["name", "authErrors.invalidName"],
  ["email", "authErrors.invalidEmail"],
  ["password", "authErrors.invalidPassword"],
]);

/**
 * Maps a failed auth request to a translation key. The API answers with English ProblemDetails and
 * no error codes, so the status code (plus the invalid field on a 400) is the stable contract.
 */
export function toAuthErrorKey(error: unknown, operation: AuthOperation): string {
  if (!(error instanceof HttpErrorResponse)) {
    return "authErrors.unexpected";
  }

  switch (error.status) {
    // No response at all, or a gateway in front of the API could not reach it.
    case 0:
    case 502:
    case 503:
    case 504:
      return "authErrors.network";
    case 400:
      return validationErrorKey(error.error);
    case 401:
      // Login answers 401 for bad credentials; anywhere else it means the session is gone.
      return operation === "login" ? "authErrors.invalidCredentials" : "authErrors.sessionExpired";
    case 409:
      return "authErrors.emailTaken";
    default:
      return "authErrors.unexpected";
  }
}

function validationErrorKey(body: unknown): string {
  // Field names arrive in PascalCase ("Email"), so compare them case-insensitively.
  const field = isProblemDetails(body) && body.errors ? Object.keys(body.errors)[0] : undefined;

  return FIELD_ERROR_KEYS.get(field?.toLowerCase() ?? "") ?? "authErrors.invalidRequest";
}
