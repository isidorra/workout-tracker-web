import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, RouterLink],
  selector: "app-logo",
  styles: `
    :host {
      display: inline-flex;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: inherit;
      text-decoration: none;
      font-family: var(--app-font-condensed);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .logo__mark {
      width: 28px;
      height: 28px;
      font-size: 28px;
      color: var(--mat-sys-primary);
    }
  `,
  template: `
    <a class="logo" routerLink="/" aria-label="Home">
      <mat-icon class="logo__mark">clear_all</mat-icon>
      fitlog
    </a>
  `,
})
export class Logo {}
