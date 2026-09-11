import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

/** A rating drawn as a row of segments, the first `value` of them filled. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "meter",
    "aria-valuemin": "0",
    "[attr.aria-valuenow]": "value()",
    "[attr.aria-valuemax]": "max()",
    "[attr.aria-label]": "label()",
    "[class.rating-meter--heat]": "tone() === 'heat'",
  },
  selector: "app-rating-meter",
  styles: `
    :host {
      --rating-meter-fill: var(--mat-sys-primary);

      display: flex;
      gap: 4px;
      height: 10px;
    }

    :host(.rating-meter--heat) {
      --rating-meter-fill: var(--app-heat);
    }

    // Segments shrink with the column, so the meter never overflows on narrow screens.
    .rating-meter__segment {
      flex: 1;
      min-width: 0;
      border-radius: 3px;
      background: var(--app-line);
    }

    .rating-meter__segment--filled {
      background: var(--rating-meter-fill);
    }
  `,
  template: `
    @for (index of segments(); track index) {
      <span
        class="rating-meter__segment"
        [class.rating-meter__segment--filled]="index < value()"
        aria-hidden="true"
      ></span>
    }
  `,
})
export class RatingMeter {
  readonly value = input.required<number>();
  readonly max = input(10);

  readonly label = input.required<string>();
  readonly tone = input<"primary" | "heat">("primary");

  protected readonly segments = computed(() =>
    Array.from({ length: this.max() }, (_, index) => index),
  );
}
