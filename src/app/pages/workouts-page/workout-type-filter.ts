import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { WORKOUT_TYPES, WORKOUT_TYPE_KEYS, WorkoutType } from "../../workouts/workouts-models";

/** Exclusive type filter: All, then each workout type. Selected is filled, the rest outlined. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, TranslocoDirective, TranslocoPipe],
  selector: "app-workout-type-filter",
  styles: `
    :host {
      display: block;
      margin-bottom: 16px;
    }

    [role="radiogroup"] {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `,
  template: `
    <div
      *transloco="let t; prefix: 'workoutsPage'"
      role="radiogroup"
      [attr.aria-label]="t('filterGroup')"
    >
      <button
        type="button"
        role="radio"
        [matButton]="selected() === null ? 'filled' : 'outlined'"
        [attr.aria-checked]="selected() === null"
        (click)="select(null)"
      >
        {{ t("filterAll") }}
      </button>

      @for (option of typeOptions; track option.value) {
        <button
          type="button"
          role="radio"
          [matButton]="selected() === option.value ? 'filled' : 'outlined'"
          [attr.aria-checked]="selected() === option.value"
          (click)="select(option.value)"
        >
          {{ option.nameKey | transloco }}
        </button>
      }
    </div>
  `,
})
export class WorkoutTypeFilter {
  readonly selected = input.required<WorkoutType | null>();
  readonly selectedChange = output<WorkoutType | null>();

  protected readonly typeOptions = WORKOUT_TYPES.map((type) => ({
    value: type,
    nameKey: `workoutType.${WORKOUT_TYPE_KEYS[type]}.name`,
  }));

  protected select(type: WorkoutType | null): void {
    if (type === this.selected()) {
      return;
    }

    this.selectedChange.emit(type);
  }
}
