import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import {
  DashboardSummary,
  toLocalDateTime,
  weekDayFormatKey,
} from "../../../dashboard/dashboard-models";
import { Language } from "../../../i18n/language";
import { DashboardStats } from "./dashboard-stats";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DashboardStats, MatButton, MatCard, RouterLink, TranslocoDirective],
  selector: "app-dashboard-week",
  styles: `
    :host {
      display: block;
    }

    mat-card {
      padding: 20px 24px;
    }

    .dashboard-week__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    h2 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    .dashboard-week__range {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }
  `,
  template: `
    <mat-card appearance="outlined" *transloco="let t; prefix: 'dashboard'">
      <div class="dashboard-week__header">
        <div>
          <h2>{{ t("weekHeading") }}</h2>
          <p class="dashboard-week__range">
            {{
              t("weekRange", {
                start: (weekStartAt() | date: t(rangeFormatKey()) : undefined : locale()),
                end: (weekEndAt() | date: t(rangeFormatKey()) : undefined : locale()),
              })
            }}
          </p>
        </div>

        <a matButton="outlined" routerLink="/workouts">{{ t("seeAllWorkouts") }}</a>
      </div>

      <app-dashboard-stats [stats]="dashboard().week" />
    </mat-card>
  `,
})
export class DashboardWeek {
  private readonly language = inject(Language);

  readonly dashboard = input.required<DashboardSummary>();

  protected readonly locale = computed(() => this.language.current().htmlLang);

  protected readonly weekStartAt = computed(() => toLocalDateTime(this.dashboard().weekStart));
  protected readonly weekEndAt = computed(() => toLocalDateTime(this.dashboard().weekEnd));

  protected readonly rangeFormatKey = computed(() =>
    weekDayFormatKey(this.dashboard().weekStart, this.dashboard().weekEnd),
  );
}
