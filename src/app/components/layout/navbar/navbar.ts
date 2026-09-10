import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { ThemeToggler } from "../../common/theme-toggler/theme-toggler";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, MatButton, MatIcon, RouterLink, ThemeToggler],
  selector: "app-navbar",
  styles: `
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 5;
      height: 62px;
      padding: 0;

      // The mockup's header sits on surface, not the toolbar default surface-container.
      background: var(--mat-sys-surface);
      border-bottom: 1px solid var(--app-line);
    }

    .navbar__inner {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .navbar__logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      // Push the actions right without stretching the link's clickable area across the gap.
      margin-right: auto;
      color: inherit;
      text-decoration: none;
      font-family: var(--app-font-condensed);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .navbar__mark {
      // mat-icon sizes its box separately from the glyph, so all three must change together.
      width: 28px;
      height: 28px;
      font-size: 28px;
      color: var(--mat-sys-primary);
    }
  `,
  template: `
    <mat-toolbar>
      <div class="navbar__inner">
        <a class="navbar__logo" routerLink="/" aria-label="Home">
          <mat-icon class="navbar__mark">clear_all</mat-icon>
          fitlog
        </a>

        <a matButton routerLink="/login">Login</a>
        <a matButton="filled" routerLink="/register">Register</a>
        <app-theme-toggler />
      </div>
    </mat-toolbar>
  `,
})
export class Navbar {}
