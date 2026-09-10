import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { Logo } from "../../common/logo/logo";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardFooter,
    Logo,
  ],
  selector: "app-auth-card",
  styles: `
    @use "@angular/material" as mat;

    :host {
      --auth-card-gutter: 40px;

      display: block;
      width: 100%;
      max-width: 500px;
      margin: auto;

      @include mat.card-overrides(
        (
          title-text-font: var(--app-font-condensed),
          title-text-size: 36px,
          title-text-line-height: 1,
          title-text-weight: 700,
          title-text-tracking: 0,
          subtitle-text-color: var(--mat-sys-on-surface-variant),
          subtitle-text-font: var(--mat-sys-body-large-font),
          subtitle-text-size: var(--mat-sys-body-large-size),
          subtitle-text-line-height: var(--mat-sys-body-large-line-height),
          subtitle-text-tracking: var(--mat-sys-body-large-tracking),
          subtitle-text-weight: var(--mat-sys-body-large-weight),
        )
      );

      @include mat.button-overrides(
        (
          filled-container-height: 48px,
        )
      );
    }

    @media (max-width: 480px) {
      :host {
        --auth-card-gutter: 20px;
      }
    }

    mat-card {
      overflow: hidden;
    }

    app-logo {
      align-self: flex-start;
      margin: var(--auth-card-gutter) var(--auth-card-gutter) 24px;
      font-size: 22px;
    }

    mat-card-header {
      padding: 0 var(--auth-card-gutter);
    }

    h1 {
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    mat-card-content {
      padding: 24px var(--auth-card-gutter) 40px;
    }

    mat-card-footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 10px var(--auth-card-gutter);
      border-top: 1px solid var(--app-line);
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface-variant);
    }
  `,
  template: `
    <mat-card appearance="outlined">
      <app-logo />

      <mat-card-header>
        <h1 matCardTitle>{{ heading() }}</h1>
        <p matCardSubtitle>{{ description() }}</p>
      </mat-card-header>

      <mat-card-content>
        <ng-content />
      </mat-card-content>

      <mat-card-footer>
        <ng-content select="[authCardFooter]" />
      </mat-card-footer>
    </mat-card>
  `,
})
export class AuthCard {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
}
