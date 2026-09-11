import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { WorkoutsPageActions } from "../../workouts/workouts-actions";
import { workoutsFeature } from "../../workouts/workouts-feature";
import { WORKOUT_TYPE_KEYS, WorkoutType } from "../../workouts/workouts-models";
import { WorkoutDialog } from "./workout-dialog";
import { WorkoutList } from "./workout-list";
import { WorkoutPager } from "./workout-pager";
import { WorkoutTypeFilter } from "./workout-type-filter";
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
    WorkoutPager,
    WorkoutTypeFilter,
    WorkoutsPlaceholder,
  ],
  selector: "app-workouts-page",
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

    // On narrow screens the button wraps below the heading instead of squeezing it.
    .workouts__header {
      display: flex;
      flex-shrink: 0;
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

    app-workout-type-filter,
    app-workout-pager {
      flex-shrink: 0;
    }

    // The card fills the leftover height; only the rows scroll, so the header and pager stay put.
    mat-card {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }

    app-workouts-placeholder {
      flex: 1;
      justify-content: center;
    }

    .workouts__loading {
      display: flex;
      flex: 1;
      align-items: center;
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

      @if (showFilters()) {
        <app-workout-type-filter
          [selected]="filterType()"
          (selectedChange)="onFilterChange($event)"
        />
      }

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
          @case ("filterEmpty") {
            <app-workouts-placeholder
              icon="fitness_center"
              [heading]="t('emptyFilterHeading', { type: (filterTypeNameKey() | transloco) })"
              [description]="
                t('emptyFilterDescription', { type: (filterTypeNameKey() | transloco) })
              "
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

      @if (showPager()) {
        <app-workout-pager
          [page]="page()"
          [pageCount]="pageCount()"
          (pageChange)="onPageChange($event)"
        />
      }
    </section>
  `,
})
export class WorkoutsPage {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  protected readonly view = this.store.selectSignal(workoutsFeature.selectView);
  protected readonly workouts = this.store.selectSignal(workoutsFeature.selectWorkouts);
  protected readonly errorKey = this.store.selectSignal(workoutsFeature.selectErrorKey);
  protected readonly filterType = this.store.selectSignal(workoutsFeature.selectType);
  protected readonly page = this.store.selectSignal(workoutsFeature.selectPage);
  protected readonly pageCount = this.store.selectSignal(workoutsFeature.selectPageCount);

  // First visit: nothing loaded yet, so the filter would sit above a spinner. Stay visible while a
  // later load is in flight, including when the current type has no rows.
  protected readonly showFilters = computed(() => {
    if (this.view() === "error") {
      return false;
    }

    return this.view() !== "loading" || this.filterType() !== null || this.workouts().length > 0;
  });

  protected readonly showPager = computed(() => this.view() === "list" && this.pageCount() > 1);

  protected readonly filterTypeNameKey = computed(() => {
    const type = this.filterType();

    return type === null ? "" : `workoutType.${WORKOUT_TYPE_KEYS[type]}.name`;
  });

  constructor() {
    // Every visit refetches, so workouts logged elsewhere show up without a reload.
    this.store.dispatch(WorkoutsPageActions.opened());
  }

  protected retry(): void {
    this.store.dispatch(WorkoutsPageActions.retryClicked());
  }

  protected onFilterChange(filterType: WorkoutType | null): void {
    this.store.dispatch(WorkoutsPageActions.filterChanged({ filterType }));
  }

  protected onPageChange(page: number): void {
    this.store.dispatch(WorkoutsPageActions.pageChanged({ page }));
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
