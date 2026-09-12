import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { authFeature } from "../../../auth/auth-feature";
import { DashboardPageActions } from "../../../dashboard/dashboard-actions";
import { dashboardFeature } from "../../../dashboard/dashboard-feature";
import { isCurrentOrFutureMonth, shiftMonth } from "../../../dashboard/dashboard-models";
import { WorkoutDialog } from "../../workouts-page/workout-dialog";
import { WorkoutsPlaceholder } from "../../workouts-page/workouts-placeholder";
import { DashboardProgressCard } from "./dashboard-progress";
import { DashboardToday } from "./dashboard-today";
import { DashboardWeek } from "./dashboard-week";

/** What signed-in users see at `/`. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardProgressCard,
    DashboardToday,
    DashboardWeek,
    MatButton,
    MatProgressSpinner,
    TranslocoDirective,
    TranslocoPipe,
    WorkoutsPlaceholder,
  ],
  selector: "app-dashboard",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;

      // The lime primary barely shows on the light surface, so the spinner takes the text color.
      @include mat.progress-spinner-overrides(
        (
          active-indicator-color: var(--mat-sys-on-surface-variant),
        )
      );
    }

    section {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    h1 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    .dashboard__header {
      flex-shrink: 0;
      margin-bottom: 24px;
    }

    .dashboard__greeting {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }

    // The heading stays put; only the cards (or the loading/error stand-in) scroll.
    .dashboard__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }

    .dashboard__loading {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding: 56px 24px;
    }

    app-workouts-placeholder {
      flex: 1;
      justify-content: center;
    }

    .dashboard__cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .dashboard__action {
      margin-top: 24px;
    }
  `,
  template: `
    <section *transloco="let t; prefix: 'dashboard'">
      <div class="dashboard__header">
        <h1>{{ t("heading") }}</h1>

        @if (user(); as user) {
          <p class="dashboard__greeting">{{ t("greeting", { name: user.name }) }}</p>
        }
      </div>

      <div class="dashboard__body">
        @switch (view()) {
          @case ("loading") {
            <div class="dashboard__loading">
              <mat-spinner diameter="32" [attr.aria-label]="t('loading')" />
            </div>
          }
          @case ("error") {
            <app-workouts-placeholder
              icon="error_outline"
              [heading]="t('errorHeading')"
              [description]="errorKey() | transloco"
            >
              <button
                matButton="outlined"
                type="button"
                class="dashboard__action"
                (click)="retry()"
              >
                {{ t("retry") }}
              </button>
            </app-workouts-placeholder>
          }
          @case ("ready") {
            @if (dashboard(); as dashboard) {
              <div class="dashboard__cards">
                <app-dashboard-today [dashboard]="dashboard" (logWorkout)="openDialog()" />
                <app-dashboard-week [dashboard]="dashboard" />
                <app-dashboard-progress
                  [month]="progressMonth()"
                  [progress]="progress()"
                  [view]="progressView()"
                  [errorKey]="progressErrorKey()"
                  (previous)="previousMonth()"
                  (next)="nextMonth()"
                  (retry)="retryProgress()"
                />
              </div>
            }
          }
        }
      </div>
    </section>
  `,
})
export class Dashboard {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  protected readonly user = this.store.selectSignal(authFeature.selectUser);
  protected readonly view = this.store.selectSignal(dashboardFeature.selectView);
  protected readonly dashboard = this.store.selectSignal(dashboardFeature.selectDashboard);
  protected readonly errorKey = this.store.selectSignal(dashboardFeature.selectErrorKey);
  protected readonly progress = this.store.selectSignal(dashboardFeature.selectProgress);
  protected readonly progressMonth = this.store.selectSignal(dashboardFeature.selectProgressMonth);
  protected readonly progressView = this.store.selectSignal(dashboardFeature.selectProgressView);
  protected readonly progressErrorKey = this.store.selectSignal(
    dashboardFeature.selectProgressErrorKey,
  );

  constructor() {
    // Every visit refetches, so workouts logged elsewhere show up without a reload.
    this.store.dispatch(DashboardPageActions.opened());
  }

  protected retry(): void {
    this.store.dispatch(DashboardPageActions.retryClicked());
  }

  protected retryProgress(): void {
    this.store.dispatch(DashboardPageActions.progressRetryClicked());
  }

  protected previousMonth(): void {
    this.store.dispatch(DashboardPageActions.monthChanged(shiftMonth(this.progressMonth(), -1)));
  }

  protected nextMonth(): void {
    if (isCurrentOrFutureMonth(this.progressMonth())) {
      return;
    }

    this.store.dispatch(DashboardPageActions.monthChanged(shiftMonth(this.progressMonth(), 1)));
  }

  protected openDialog(): void {
    this.dialog.open(WorkoutDialog, {
      width: "680px",
      maxWidth: "calc(100vw - 32px)",
      // The dialog itself rather than its first tabbable element, which is the close button; screen
      // readers then start from the title.
      autoFocus: "dialog",
    });
  }
}
