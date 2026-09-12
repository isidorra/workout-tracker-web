import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, RouterLink, TranslocoDirective],
  selector: "app-not-found-page",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: flex;
      flex: 1;

      @include mat.button-overrides(
        (
          filled-container-height: 48px,
        )
      );
    }

    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 480px;
      margin: auto;
      text-align: center;
    }

    .not-found__code {
      margin: 0 0 16px;
      font-family: var(--app-font-condensed);
      font-size: clamp(96px, 30vw, 160px);
      font-weight: 700;
      line-height: 0.85;
    }

    h1 {
      margin: 0 0 8px;
      font-family: var(--app-font-condensed);
      font-size: clamp(28px, 8vw, 36px);
      font-weight: 700;
      line-height: 1;
      text-transform: uppercase;
    }

    .not-found__description {
      margin: 0 0 32px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-large);
    }
  `,
  template: `
    <section *transloco="let t; prefix: 'notFoundPage'" class="not-found">
      <p class="not-found__code">404</p>
      <h1>{{ t("heading") }}</h1>
      <p class="not-found__description">{{ t("description") }}</p>
      <a matButton="filled" routerLink="/">{{ t("homeLink") }}</a>
    </section>
  `,
})
export class NotFoundPage {}
