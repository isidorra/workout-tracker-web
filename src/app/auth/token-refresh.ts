import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, finalize, map, share, tap } from "rxjs";
import { AuthActions } from "./auth-actions";
import { AuthApi } from "./auth-api";

/** Exchanges the refresh cookie for a new access token when the current one has expired. */
@Injectable({ providedIn: "root" })
export class TokenRefresh {
  private readonly api = inject(AuthApi);
  private readonly store = inject(Store);

  private inFlight: Observable<string> | null = null;

  /** Requests that fail together share one refresh, so the rotating cookie is spent only once. */
  refresh(): Observable<string> {
    this.inFlight ??= this.api.refresh().pipe(
      map(({ accessToken }) => accessToken),
      tap({
        next: (accessToken) => this.store.dispatch(AuthActions.tokenRefreshed({ accessToken })),
        error: () => this.store.dispatch(AuthActions.sessionExpired()),
      }),
      // Before share(), so the slot is cleared once per request rather than once per subscriber.
      finalize(() => (this.inFlight = null)),
      // Finish the request even if every caller unsubscribes: the server may already have rotated
      // the cookie, and dropping the response would lose the only valid token.
      share({ resetOnRefCountZero: false }),
    );

    return this.inFlight;
  }
}
