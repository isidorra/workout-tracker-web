import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@jsverse/transloco";
import { take } from "rxjs";

const DURATION_MS = 6000;

/** Shows short, translated notifications at the top of the screen. */
@Injectable({ providedIn: "root" })
export class Toast {
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  show(messageKey: string, params?: Record<string, unknown>): void {
    // selectTranslate waits for the active language file, so a toast raised while a language is
    // still loading never shows a raw key.
    this.transloco
      .selectTranslate<string>(messageKey, params)
      .pipe(take(1))
      .subscribe((message) => {
        this.snackBar.open(message, this.transloco.translate("toast.dismiss"), {
          duration: DURATION_MS,
          verticalPosition: "top",
        });
      });
  }
}
