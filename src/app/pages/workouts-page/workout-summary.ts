import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Language } from "../../i18n/language";
import { WORKOUT_TYPE_KEYS, Workout } from "../../workouts/workouts-models";

interface DurationParts {
  key: string;
  params: Record<string, number>;
}

/** The `duration.*` translation and params for a compact length, e.g. 70 minutes → "1h 10m". */
export function toDurationParts(totalMinutes: number): DurationParts {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return { key: "duration.minutes", params: { minutes } };
  }

  if (minutes === 0) {
    return { key: "duration.hours", params: { hours } };
  }

  return { key: "duration.hoursMinutes", params: { hours, minutes } };
}

/** The always-visible part of a workout row: type, date, duration and calories. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TranslocoDirective, TranslocoPipe],
  selector: "app-workout-summary",
  styles: `
    :host {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .workout-summary__badge {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      border: 1px solid var(--app-line);
      border-radius: 9px;
      color: var(--mat-sys-on-surface-variant);
      font-family: var(--app-font-condensed);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.06em;
      line-height: 1;
      text-transform: uppercase;
      transition:
        background-color 150ms,
        border-color 150ms,
        color 150ms;
    }

    // The panel header this sits in carries .mat-expanded while its row is open.
    :host-context(.mat-expanded) .workout-summary__badge {
      border-color: transparent;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }

    // min-width lets the date wrap instead of pushing the stats out on narrow screens.
    .workout-summary__text {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .workout-summary__title {
      font: var(--mat-sys-title-medium);
    }

    .workout-summary__date {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }

    .workout-summary__stats {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      gap: 16px;
      // Keeps the pair clear of the accordion chevron.
      margin-right: 24px;
    }

    .workout-summary__stat {
      font-family: var(--app-font-condensed);
      font-size: 22px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .workout-summary__divider {
      align-self: stretch;
      width: 1px;
      background: var(--app-line);
    }
  `,
  // The badge repeats the type name as a code, so screen readers skip it. DatePipe reads a date-time
  // without an offset as local time, so `performedAt` shows exactly the time the user entered.
  template: `
    <ng-container *transloco="let t; prefix: 'workoutSummary'">
      <span class="workout-summary__badge" aria-hidden="true">{{ typeCodeKey() | transloco }}</span>

      <span class="workout-summary__text">
        <span class="workout-summary__title">{{ typeNameKey() | transloco }}</span>
        <span class="workout-summary__date">
          {{ workout().performedAt | date: t(dateFormatKey()) : undefined : locale() }}
        </span>
      </span>

      <span class="workout-summary__stats">
        <span class="workout-summary__stat">{{ t(duration().key, duration().params) }}</span>
        <span class="workout-summary__divider" aria-hidden="true"></span>
        <span class="workout-summary__stat">{{ t("kcal", { value: workout().calories }) }}</span>
      </span>
    </ng-container>
  `,
})
export class WorkoutSummary {
  private readonly language = inject(Language);

  readonly workout = input.required<Workout>();

  // Follows the UI language; the Serbian locale data is registered in provide-i18n.ts.
  protected readonly locale = computed(() => this.language.current().htmlLang);

  protected readonly typeCodeKey = computed(
    () => `workoutType.${WORKOUT_TYPE_KEYS[this.workout().type]}.code`,
  );

  protected readonly typeNameKey = computed(
    () => `workoutType.${WORKOUT_TYPE_KEYS[this.workout().type]}.name`,
  );

  // `performedAt` is ISO formatted, so it starts with the year; the year only shows when it differs.
  protected readonly dateFormatKey = computed(() =>
    this.workout().performedAt.startsWith(String(new Date().getFullYear()))
      ? "dateFormat"
      : "dateFormatWithYear",
  );

  protected readonly duration = computed(() => toDurationParts(this.workout().durationMinutes));
}
