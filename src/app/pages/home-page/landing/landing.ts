import { DatePipe, DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import {
  toLocalDateOnly,
  toLocalDateTime,
  weekDayFormatKey,
} from "../../../dashboard/dashboard-models";
import { Language } from "../../../i18n/language";
import { toDurationParts } from "../../../shared/duration";
import { RATING_MAX } from "../../../workouts/workouts-models";

/** Sample week so the landing card looks like the signed-in dashboard. */
const PREVIEW_MINUTES = 215;
const PREVIEW_WORKOUTS = 4;
const PREVIEW_DIFFICULTY = 6.8;
const PREVIEW_FATIGUE = 5.4;

function currentWeekBounds(now = new Date()): { weekStart: string; weekEnd: string } {
  const weekday = now.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

  return {
    weekStart: toLocalDateOnly(monday),
    weekEnd: toLocalDateOnly(sunday),
  };
}

/** What signed-out visitors see at `/`. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, MatButton, MatCard, RouterLink, TranslocoDirective, TranslocoPipe],
  selector: "app-landing",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: flex;
      flex: 1;

      @include mat.button-overrides(
        (
          filled-container-height: 48px,
          outlined-container-height: 48px,
        )
      );
    }

    .landing {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 48px;
      width: 100%;
      margin: auto;
      text-align: center;
    }

    .landing__copy {
      width: 80%;
    }

    .landing__kicker {
      margin: 0 0 20px;
      color: light-dark(#4e6700, #c3f53c);
      font-family: var(--app-font-condensed);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.08em;
      line-height: 1;
      text-transform: uppercase;
    }

    h1 {
      margin: 0 0 20px;
      font-family: var(--app-font-condensed);
      font-size: clamp(56px, 11vw, 104px);
      font-weight: 700;
      line-height: 0.88;
      text-transform: uppercase;
    }

    .landing__description {
      margin: 0 auto 36px auto;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
      font-size: 1.125rem;
      line-height: 1.5;
      max-width: 44rem;
    }

    .landing__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }

    mat-card {
      box-sizing: border-box;
      width: 100%;
      padding: 24px 28px;
      text-align: left;
    }

    .landing__preview-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }

    .landing__preview-badge {
      flex-shrink: 0;
      padding: 4px 8px;
      border-radius: 6px;
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface-variant);
      font-family: var(--app-font-condensed);
      font-size: 12px;
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

    .landing__preview-range {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }

    .landing__stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
    }

    .landing__stat + .landing__stat {
      border-left: 1px solid var(--app-line);
      padding-left: 24px;
    }

    .landing__value {
      display: block;
      margin-bottom: 6px;
      font-family: var(--app-font-condensed);
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }

    @media (max-width: 599px) {
      .landing__stat + .landing__stat {
        padding-left: 12px;
      }

      .landing__value {
        font-size: 22px;
      }
    }

    .landing__stat--time .landing__value {
      color: light-dark(#0e7490, #5eead4);
    }

    .landing__stat--count .landing__value {
      color: light-dark(#4e6700, #c3f53c);
    }

    .landing__stat--difficulty .landing__value {
      color: light-dark(#8a5a00, #f5c542);
    }

    .landing__stat--fatigue .landing__value {
      color: var(--app-heat);
    }

    .landing__label {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }
  `,
  template: `
    <section *transloco="let t; prefix: 'landing'" class="landing">
      <div class="landing__copy">
        <p class="landing__kicker">{{ t("kicker") }}</p>
        <h1>{{ t("heading") }}</h1>
        <p class="landing__description">{{ t("description") }}</p>

        <div class="landing__actions">
          <a matButton="filled" routerLink="/register">{{ t("register") }}</a>
          <a matButton="outlined" routerLink="/login">{{ t("login") }}</a>
        </div>
      </div>

      <mat-card appearance="outlined">
        <div class="landing__preview-header">
          <div>
            <h2>{{ t("previewHeading") }}</h2>
            <p class="landing__preview-range">
              {{
                t("weekRange", {
                  start: (weekStartAt | date: t(rangeFormatKey) : undefined : locale()),
                  end: (weekEndAt | date: t(rangeFormatKey) : undefined : locale()),
                })
              }}
            </p>
          </div>

          <span class="landing__preview-badge">{{ t("previewBadge") }}</span>
        </div>

        <div class="landing__stats">
          <div class="landing__stat landing__stat--time">
            <span class="landing__value">
              {{ duration.key | transloco: duration.params }}
            </span>
            <span class="landing__label">{{ "dashboard.timeTrained" | transloco }}</span>
          </div>

          <div class="landing__stat landing__stat--count">
            <span class="landing__value">{{ workoutCount }}</span>
            <span class="landing__label">{{ "dashboard.workoutsDone" | transloco }}</span>
          </div>

          <div class="landing__stat landing__stat--difficulty">
            <span class="landing__value">
              {{
                "dashboard.rating"
                  | transloco: { value: (difficulty | number: "1.1-1" : locale()), max: ratingMax }
              }}
            </span>
            <span class="landing__label">{{ "dashboard.avgDifficulty" | transloco }}</span>
          </div>

          <div class="landing__stat landing__stat--fatigue">
            <span class="landing__value">
              {{
                "dashboard.rating"
                  | transloco: { value: (fatigue | number: "1.1-1" : locale()), max: ratingMax }
              }}
            </span>
            <span class="landing__label">{{ "dashboard.avgFatigue" | transloco }}</span>
          </div>
        </div>
      </mat-card>
    </section>
  `,
})
export class Landing {
  private readonly language = inject(Language);
  private readonly week = currentWeekBounds();

  protected readonly ratingMax = RATING_MAX;
  protected readonly workoutCount = PREVIEW_WORKOUTS;
  protected readonly difficulty = PREVIEW_DIFFICULTY;
  protected readonly fatigue = PREVIEW_FATIGUE;
  protected readonly weekStartAt = toLocalDateTime(this.week.weekStart);
  protected readonly weekEndAt = toLocalDateTime(this.week.weekEnd);
  protected readonly rangeFormatKey = weekDayFormatKey(this.week.weekStart, this.week.weekEnd);
  protected readonly locale = computed(() => this.language.current().htmlLang);

  protected readonly duration = (() => {
    const parts = toDurationParts(PREVIEW_MINUTES);

    return { key: `workoutSummary.${parts.key}`, params: parts.params };
  })();
}
