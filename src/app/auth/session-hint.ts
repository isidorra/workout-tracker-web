import { DOCUMENT, Injectable, inject } from "@angular/core";

const STORAGE_KEY = "workout-tracker.session";

/**
 * Remembers whether this browser has signed in before. The refresh token is an HttpOnly cookie the
 * app cannot read, so without this flag every first-time visitor would pay for a doomed refresh
 * call at startup. It holds no secret; a stale flag only costs one 401.
 */
@Injectable({ providedIn: "root" })
export class SessionHint {
  private readonly document = inject(DOCUMENT);

  has(): boolean {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Storage is unavailable in some privacy modes; assume no session and skip the refresh.
      return false;
    }
  }

  set(): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage is unavailable in some privacy modes; the session still works until a reload.
    }
  }

  clear(): void {
    try {
      this.document.defaultView?.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is unavailable in some privacy modes; there is nothing to clear.
    }
  }
}
