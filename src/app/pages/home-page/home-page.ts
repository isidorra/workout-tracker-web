import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { authFeature } from "../../auth/auth-feature";
import { Dashboard } from "./dashboard/dashboard";
import { Landing } from "./landing/landing";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dashboard, Landing],
  selector: "app-home-page",
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
    }
  `,
  template: `
    @if (isAuthenticated()) {
      <app-dashboard />
    } @else {
      <app-landing />
    }
  `,
})
export class HomePage {
  protected readonly isAuthenticated = inject(Store).selectSignal(
    authFeature.selectIsAuthenticated,
  );
}
