import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import {
  DashboardProgress,
  DashboardView,
  ProgressMonth,
  isCurrentOrFutureMonth,
  toLocalDateTime,
  toMonthDate,
  weekDayFormatKey,
} from "../../../dashboard/dashboard-models";
import { Language } from "../../../i18n/language";
import { DashboardStats } from "./dashboard-stats";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DashboardStats,
    MatButton,
    MatCard,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    TranslocoDirective,
    TranslocoPipe,
  ],
  selector: "app-dashboard-progress",
  styles: `
    :host {
      display: block;
    }

    mat-card {
      padding: 20px 24px;
    }

    .dashboard-progress__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    h2 {
      margin: 0;
      font-family: var(--app-font-condensed);
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    .dashboard-progress__month {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .dashboard-progress__label {
      min-width: 10ch;
      text-align: center;
      font: var(--mat-sys-title-medium);
    }

    .dashboard-progress__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 0;
    }

    .dashboard-progress__error {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
      text-align: center;
    }

    .dashboard-progress__weeks {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .dashboard-progress__week + .dashboard-progress__week {
      padding-top: 24px;
      border-top: 1px solid var(--app-line);
    }

    .dashboard-progress__range {
      margin: 0 0 16px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-title-medium);
    }
  `,
  template: `
    <mat-card appearance="outlined" *transloco="let t; prefix: 'dashboard'">
      <div class="dashboard-progress__header">
        <h2>{{ t("progressHeading") }}</h2>

        <div class="dashboard-progress__month">
          <button
            matIconButton
            type="button"
            [attr.aria-label]="t('previousMonth')"
            (click)="previous.emit()"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>

          <span class="dashboard-progress__label">
            {{ monthAt() | date: t("monthFormat") : undefined : locale() }}
          </span>

          <button
            matIconButton
            type="button"
            [attr.aria-label]="t('nextMonth')"
            [disabled]="atLatestMonth()"
            (click)="next.emit()"
          >
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      @switch (view()) {
        @case ("loading") {
          <div class="dashboard-progress__loading">
            <mat-spinner diameter="32" [attr.aria-label]="t('progressLoading')" />
          </div>
        }
        @case ("error") {
          <div class="dashboard-progress__error">
            <span>{{ errorKey() | transloco }}</span>
            <button matButton="outlined" type="button" (click)="retry.emit()">
              {{ t("retry") }}
            </button>
          </div>
        }
        @case ("ready") {
          @if (progress(); as progress) {
            <div class="dashboard-progress__weeks">
              @for (week of progress.weeks; track week.weekStart) {
                <div class="dashboard-progress__week">
                  <p class="dashboard-progress__range">
                    {{
                      t("weekRange", {
                        start:
                          (toLocalDateTime(week.weekStart)
                          | date: t(weekDayFormatKey(week.weekStart, week.weekEnd))
                          : undefined
                          : locale()),
                        end:
                          (toLocalDateTime(week.weekEnd)
                          | date: t(weekDayFormatKey(week.weekStart, week.weekEnd))
                          : undefined
                          : locale()),
                      })
                    }}
                  </p>
                  <app-dashboard-stats [stats]="week" />
                </div>
              }
            </div>
          }
        }
      }
    </mat-card>
  `,
})
export class DashboardProgressCard {
  private readonly language = inject(Language);

  readonly month = input.required<ProgressMonth>();
  readonly progress = input<DashboardProgress | null>(null);
  readonly view = input.required<DashboardView>();
  readonly errorKey = input<string | null>(null);

  readonly previous = output();
  readonly next = output();
  readonly retry = output();

  protected readonly locale = computed(() => this.language.current().htmlLang);
  protected readonly monthAt = computed(() => toMonthDate(this.month()));
  protected readonly atLatestMonth = computed(() => isCurrentOrFutureMonth(this.month()));

  protected readonly toLocalDateTime = toLocalDateTime;
  protected readonly weekDayFormatKey = weekDayFormatKey;
}
