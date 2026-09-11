import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import {
  MaxLengthValidationError,
  MinLengthValidationError,
  ValidationError,
} from "@angular/forms/signals";
import { TranslocoPipe } from "@jsverse/transloco";

/**
 * Translated message for a form validation error. Place it inside `<mat-error>`, which the form
 * field only reveals once the control has been touched or the form submitted.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  selector: "app-field-error",
  template: `{{ key() | transloco: params() }}`,
})
export class FieldError {
  readonly error = input.required<ValidationError>();

  protected readonly key = computed(() => `fieldError.${this.error().kind}`);

  protected readonly params = computed(() => {
    const error = this.error();

    if (error instanceof MinLengthValidationError) {
      return { min: error.minLength };
    }

    if (error instanceof MaxLengthValidationError) {
      return { max: error.maxLength };
    }

    return {};
  });
}
