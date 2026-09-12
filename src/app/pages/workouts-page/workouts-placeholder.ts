import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

/** Stands in for the workout list when there is nothing to show. Projected content goes below. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
  selector: "app-workouts-placeholder",
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 56px 24px;
      text-align: center;
    }

    .workouts-placeholder__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      margin-bottom: 20px;
      border-radius: 50%;
      background: var(--mat-sys-surface-container-high);
      color: var(--mat-sys-on-surface-variant);
    }

    mat-icon {
      width: 36px;
      height: 36px;
      font-size: 36px;
    }

    h2 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: clamp(22px, 6vw, 28px);
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    @media (max-width: 599px) {
      :host {
        padding: 32px 16px;
      }
    }

    p {
      max-width: 400px;
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }
  `,
  template: `
    <div class="workouts-placeholder__icon">
      <mat-icon>{{ icon() }}</mat-icon>
    </div>
    <h2>{{ heading() }}</h2>
    <p>{{ description() }}</p>
    <ng-content />
  `,
})
export class WorkoutsPlaceholder {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
}
