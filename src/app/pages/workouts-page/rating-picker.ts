import { ChangeDetectionStrategy, Component, input, model, output } from "@angular/core";
import { FormValueControl, ValidationError } from "@angular/forms/signals";
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from "@angular/material/button-toggle";
import { TranslocoPipe } from "@jsverse/transloco";
import { FieldError } from "../../components/common/field-error/field-error";
import { RATING_MAX, RATING_MIN } from "../../workouts/workouts-models";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.rating-picker--heat]": "tone() === 'heat'",
  },
  imports: [MatButtonToggleGroup, MatButtonToggle, TranslocoPipe, FieldError],
  selector: "app-rating-picker",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: block;

      @include mat.button-toggle-overrides(
        (
          label-text-font: var(--app-font-condensed),
          label-text-size: 16px,
          label-text-weight: 700,
        )
      );
    }

    :host(.rating-picker--heat) {
      @include mat.button-toggle-overrides(
        (
          selected-state-background-color: var(--mat-sys-tertiary),
          selected-state-text-color: var(--mat-sys-on-tertiary),
        )
      );
    }

    .rating-picker__caption {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 4px 12px;
      margin-bottom: 8px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }

    .rating-picker__reading {
      color: var(--mat-sys-on-surface);
      font-weight: 500;
    }

    .rating-picker__toggles {
      display: flex;
    }

    // Equal shares of the row, down to phone widths.
    mat-button-toggle {
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 599px) {
      :host {
        @include mat.button-toggle-overrides(
          (
            label-text-size: 14px,
          )
        );
      }
    }

    .rating-picker__error {
      margin: 6px 0 0;
      color: var(--mat-sys-error);
      font: var(--mat-sys-body-small);
    }
  `,
  template: `
    <div class="rating-picker__caption">
      <span>{{ label() }}</span>
      @if (value(); as picked) {
        <span class="rating-picker__reading">
          {{ picked }} · {{ wordsKey() + "." + picked | transloco }}
        </span>
      }
    </div>

    <mat-button-toggle-group
      class="rating-picker__toggles app-segmented"
      hideSingleSelectionIndicator
      [attr.aria-label]="label()"
      [value]="value()"
      [disabled]="disabled()"
      (change)="select($event)"
    >
      @for (step of steps; track step) {
        <mat-button-toggle [value]="step">{{ step }}</mat-button-toggle>
      }
    </mat-button-toggle-group>

    @if (touched() && errors()[0]; as error) {
      <p class="rating-picker__error"><app-field-error [error]="error" /></p>
    }
  `,
})
export class RatingPicker implements FormValueControl<number | null> {
  readonly value = model<number | null>(null);
  readonly touched = input(false);
  readonly disabled = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly touch = output<void>();

  readonly label = input.required<string>();
  readonly wordsKey = input.required<string>();
  readonly tone = input<"primary" | "heat">("primary");

  protected readonly steps = Array.from(
    { length: RATING_MAX - RATING_MIN + 1 },
    (_, index) => RATING_MIN + index,
  );

  protected select({ value }: MatButtonToggleChange): void {
    this.value.set(value);
    this.touch.emit();
  }
}
