import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { TranslocoDirective } from "@jsverse/transloco";

/** Prev / Next for a 1-based page range. Hidden by the parent when there is only one page. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, TranslocoDirective],
  selector: "app-workout-pager",
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }

    @media (max-width: 599px) {
      :host {
        gap: 8px 12px;
      }
    }

    .workout-pager__status {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'workoutsPage'">
      <button
        matButton="outlined"
        type="button"
        [disabled]="page() <= 1"
        (click)="goTo(page() - 1)"
      >
        {{ t("previousPage") }}
      </button>

      <p class="workout-pager__status">{{ t("pageOf", { page: page(), pages: pageCount() }) }}</p>

      <button
        matButton="outlined"
        type="button"
        [disabled]="page() >= pageCount()"
        (click)="goTo(page() + 1)"
      >
        {{ t("nextPage") }}
      </button>
    </ng-container>
  `,
})
export class WorkoutPager {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly pageChange = output<number>();

  protected goTo(page: number): void {
    if (page < 1 || page > this.pageCount() || page === this.page()) {
      return;
    }

    this.pageChange.emit(page);
  }
}
