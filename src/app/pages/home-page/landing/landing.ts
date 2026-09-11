import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";

/** What signed-out visitors see at `/`. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, RouterLink, TranslocoDirective],
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
      max-width: 560px;
      margin: auto;
      text-align: center;
    }

    h1 {
      margin: 0 0 12px;
      font-family: var(--app-font-condensed);
      font-size: clamp(40px, 9vw, 64px);
      font-weight: 700;
      line-height: 0.95;
      text-transform: uppercase;
    }

    .landing__description {
      margin: 0 0 32px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }

    .landing__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }
  `,
  template: `
    <section *transloco="let t; prefix: 'landing'" class="landing">
      <h1>{{ t("heading") }}</h1>
      <p class="landing__description">{{ t("description") }}</p>

      <div class="landing__actions">
        <a matButton="filled" routerLink="/register">{{ t("register") }}</a>
        <a matButton="outlined" routerLink="/login">{{ t("login") }}</a>
      </div>
    </section>
  `,
})
export class Landing {}
