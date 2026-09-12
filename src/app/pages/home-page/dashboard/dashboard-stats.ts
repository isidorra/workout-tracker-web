import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { WeekStats } from "../../../dashboard/dashboard-models";
import { Language } from "../../../i18n/language";
import { toDurationParts } from "../../../shared/duration";
import { RATING_MAX } from "../../../workouts/workouts-models";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, TranslocoDirective, TranslocoPipe],
  selector: "app-dashboard-stats",
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px 16px;
    }

    @media (min-width: 720px) {
      :host {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0;
      }

      .dashboard-stats__stat + .dashboard-stats__stat {
        border-left: 1px solid var(--app-line);
        padding-left: 24px;
      }
    }

    .dashboard-stats__value {
      display: block;
      margin-bottom: 6px;
      font-family: var(--app-font-condensed);
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }

    @media (max-width: 599px) {
      :host {
        gap: 20px 12px;
      }

      .dashboard-stats__value {
        font-size: 22px;
      }
    }

    // Darker in light mode so the lime and gold stay readable on white.
    .dashboard-stats__stat--time .dashboard-stats__value {
      color: light-dark(#0e7490, #5eead4);
    }

    .dashboard-stats__stat--count .dashboard-stats__value {
      color: light-dark(#4e6700, #c3f53c);
    }

    .dashboard-stats__stat--difficulty .dashboard-stats__value {
      color: light-dark(#8a5a00, #f5c542);
    }

    .dashboard-stats__stat--fatigue .dashboard-stats__value {
      color: var(--app-heat);
    }

    .dashboard-stats__label {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'dashboard'">
      <div class="dashboard-stats__stat dashboard-stats__stat--time">
        <span class="dashboard-stats__value">
          {{ duration().key | transloco: duration().params }}
        </span>
        <span class="dashboard-stats__label">{{ t("timeTrained") }}</span>
      </div>

      <div class="dashboard-stats__stat dashboard-stats__stat--count">
        <span class="dashboard-stats__value">{{ stats().workoutCount }}</span>
        <span class="dashboard-stats__label">{{ t("workoutsDone") }}</span>
      </div>

      <div class="dashboard-stats__stat dashboard-stats__stat--difficulty">
        <span class="dashboard-stats__value">
          @if (stats().averageDifficulty; as difficulty) {
            {{ t("rating", { value: (difficulty | number: "1.1-1" : locale()), max: ratingMax }) }}
          } @else {
            {{ t("ratingEmpty") }}
          }
        </span>
        <span class="dashboard-stats__label">{{ t("avgDifficulty") }}</span>
      </div>

      <div class="dashboard-stats__stat dashboard-stats__stat--fatigue">
        <span class="dashboard-stats__value">
          @if (stats().averageFatigue; as fatigue) {
            {{ t("rating", { value: (fatigue | number: "1.1-1" : locale()), max: ratingMax }) }}
          } @else {
            {{ t("ratingEmpty") }}
          }
        </span>
        <span class="dashboard-stats__label">{{ t("avgFatigue") }}</span>
      </div>
    </ng-container>
  `,
})
export class DashboardStats {
  private readonly language = inject(Language);

  readonly stats = input.required<WeekStats>();

  protected readonly ratingMax = RATING_MAX;

  protected readonly locale = computed(() => this.language.current().htmlLang);

  protected readonly duration = computed(() => {
    const parts = toDurationParts(this.stats().totalDurationMinutes);

    return { key: `workoutSummary.${parts.key}`, params: parts.params };
  });
}
