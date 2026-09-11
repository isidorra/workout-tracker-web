import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { RatingMeter } from "../../components/common/rating-meter/rating-meter";
import { RATING_MAX, Workout } from "../../workouts/workouts-models";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingMeter, TranslocoDirective],
  selector: "app-workout-details",
  styles: `
    :host {
      display: block;
      padding: 4px 0 8px;
    }

    @media (min-width: 600px) {
      :host {
        padding-left: 54px;
      }
    }

    .workout-details__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px 32px;
    }

    .workout-details__caption {
      display: block;
      margin-bottom: 10px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }

    .workout-details__notes {
      margin: 20px 0 0;
      padding-top: 16px;
      border-top: 1px solid var(--app-line-subtle);
      font: var(--mat-sys-body-large);
      overflow-wrap: anywhere;
      white-space: pre-line;
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'workoutDetails'">
      <div class="workout-details__stats">
        <div>
          <span class="workout-details__caption">
            {{ t("difficulty", { value: workout().difficulty, max: ratingMax }) }}
          </span>
          <app-rating-meter
            [value]="workout().difficulty"
            [max]="ratingMax"
            [label]="t('difficultyLabel')"
          />
        </div>

        <div>
          <span class="workout-details__caption">
            {{ t("fatigue", { value: workout().fatigue, max: ratingMax }) }}
          </span>
          <app-rating-meter
            tone="heat"
            [value]="workout().fatigue"
            [max]="ratingMax"
            [label]="t('fatigueLabel')"
          />
        </div>
      </div>

      @if (workout().notes; as notes) {
        <p class="workout-details__notes">{{ notes }}</p>
      }
    </ng-container>
  `,
})
export class WorkoutDetails {
  readonly workout = input.required<Workout>();

  protected readonly ratingMax = RATING_MAX;
}
