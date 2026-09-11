import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { WorkoutsPageActions } from "../../workouts/workouts-actions";
import { workoutsFeature } from "../../workouts/workouts-feature";
import { WorkoutDialog } from "./workout-dialog";
import { WorkoutList } from "./workout-list";
import { WorkoutsPlaceholder } from "./workouts-placeholder";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    TranslocoDirective,
    TranslocoPipe,
    WorkoutList,
    WorkoutsPlaceholder,
  ],
  selector: "app-workouts-page",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: block;

      // The lime primary barely shows on the light surface, so the spinner takes the text color.
      @include mat.progress-spinner-overrides(
        (
          active-indicator-color: var(--mat-sys-on-surface-variant),
        )
      );
    }

    h1 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    // On narrow screens the button wraps below the heading instead of squeezing it.
    .workouts__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    .workouts__description {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }

    // Clips the square rows to the card's rounded corners.
    mat-card {
      overflow: hidden;
    }

    .workouts__loading {
      display: flex;
      justify-content: center;
      padding: 56px 24px;
    }

    .workouts__action {
      margin-top: 24px;
    }
  `,
  template: `
    <section *transloco="let t; prefix: 'workoutsPage'">
      <div class="workouts__header">
        <div>
          <h1>{{ t("heading") }}</h1>
          <p class="workouts__description">{{ t("description") }}</p>
        </div>

        <button matButton="filled" type="button" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          {{ t("logWorkout") }}
        </button>
      </div>

      <mat-card appearance="outlined">
        @switch (view()) {
          @case ("loading") {
            <div class="workouts__loading">
              <mat-spinner diameter="32" [attr.aria-label]="t('loading')" />
            </div>
          }
          @case ("error") {
            <app-workouts-placeholder
              icon="error_outline"
              [heading]="t('errorHeading')"
              [description]="errorKey() | transloco"
            >
              <button matButton="outlined" type="button" class="workouts__action" (click)="retry()">
                {{ t("retry") }}
              </button>
            </app-workouts-placeholder>
          }
          @case ("empty") {
            <app-workouts-placeholder
              icon="fitness_center"
              [heading]="t('emptyHeading')"
              [description]="t('emptyDescription')"
            >
              <button
                matButton="filled"
                type="button"
                class="workouts__action"
                (click)="openDialog()"
              >
                <mat-icon>add</mat-icon>
                {{ t("logWorkout") }}
              </button>
            </app-workouts-placeholder>
          }
          @case ("list") {
            <app-workout-list [workouts]="workouts()" />
          }
        }
      </mat-card>
    </section>
  `,
})
export class WorkoutsPage {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  protected readonly view = this.store.selectSignal(workoutsFeature.selectView);
  protected readonly workouts = this.store.selectSignal(workoutsFeature.selectWorkouts);
  protected readonly errorKey = this.store.selectSignal(workoutsFeature.selectErrorKey);

  constructor() {
    // Every visit refetches, so workouts logged elsewhere show up without a reload.
    this.store.dispatch(WorkoutsPageActions.opened());
  }

  protected retry(): void {
    this.store.dispatch(WorkoutsPageActions.retryClicked());
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
