import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { DashboardSummary } from "../../../dashboard/dashboard-models";
import { Language } from "../../../i18n/language";
import { toDurationParts } from "../../../shared/duration";
import { WORKOUT_TYPE_KEYS } from "../../../workouts/workouts-models";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButton, MatCard, MatIcon, TranslocoDirective, TranslocoPipe],
  selector: "app-dashboard-today",
  styles: `
    :host {
      display: block;
    }

    mat-card {
      padding: 20px 24px;
    }

    .dashboard-today__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .dashboard-today__date {
      margin: 0 0 8px;
      color: var(--mat-sys-on-surface-variant);
      font-family: var(--app-font-condensed);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.06em;
      line-height: 1;
      text-transform: uppercase;
    }

    h2 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    .dashboard-today__detail {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }
  `,
  template: `
    <mat-card appearance="outlined" *transloco="let t; prefix: 'dashboard'">
      <div class="dashboard-today__header">
        <div>
          <p class="dashboard-today__date">
            {{ todayAt() | date: t(todayDateFormatKey()) : undefined : locale() }}
          </p>
          <h2>{{ dashboard().hasWorkoutToday ? t("loggedToday") : t("nothingLoggedToday") }}</h2>

          @if (lastWorkout(); as last) {
            <p class="dashboard-today__detail">
              {{
                t("lastWorkout", {
                  type: (last.typeKey | transloco),
                  duration: (last.durationKey | transloco: last.durationParams),
                  when: (last.when | date: (last.whenFormatKey | transloco) : undefined : locale()),
                })
              }}
            </p>
          } @else {
            <p class="dashboard-today__detail">{{ t("noLastWorkout") }}</p>
          }
        </div>

        <button matButton="filled" type="button" (click)="logWorkout.emit()">
          <mat-icon>add</mat-icon>
          {{ "workoutsPage.logWorkout" | transloco }}
        </button>
      </div>
    </mat-card>
  `,
})
export class DashboardToday {
  private readonly language = inject(Language);

  readonly dashboard = input.required<DashboardSummary>();
  readonly logWorkout = output();

  protected readonly locale = computed(() => this.language.current().htmlLang);

  // Date-only API values parse as UTC; a wall-clock midnight keeps DatePipe on the same day.
  protected readonly todayAt = computed(() => `${this.dashboard().today}T00:00:00`);

  protected readonly todayDateFormatKey = computed(() =>
    this.dashboard().today.startsWith(String(new Date().getFullYear()))
      ? "todayDateFormat"
      : "todayDateFormatWithYear",
  );

  protected readonly lastWorkout = computed(() => {
    const last = this.dashboard().lastWorkout;

    if (last === null) {
      return null;
    }

    const duration = toDurationParts(last.durationMinutes);

    return {
      typeKey: `workoutType.${WORKOUT_TYPE_KEYS[last.type]}.name`,
      durationKey: `workoutSummary.${duration.key}`,
      durationParams: duration.params,
      when: last.performedAt,
      whenFormatKey: last.performedAt.startsWith(String(new Date().getFullYear()))
        ? "workoutSummary.dateFormat"
        : "workoutSummary.dateFormatWithYear",
    };
  });
}
