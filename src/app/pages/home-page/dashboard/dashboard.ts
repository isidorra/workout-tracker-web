import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { authFeature } from "../../../auth/auth-feature";

/** What signed-in users see at `/`. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  selector: "app-dashboard",
  styles: `
    :host {
      display: block;
    }

    h1 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    .dashboard__greeting {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }
  `,
  template: `
    <section *transloco="let t; prefix: 'dashboard'">
      <h1>{{ t("heading") }}</h1>

      @if (user(); as user) {
        <p class="dashboard__greeting">{{ t("greeting", { name: user.name }) }}</p>
      }
    </section>
  `,
})
export class Dashboard {
  protected readonly user = inject(Store).selectSignal(authFeature.selectUser);
}
