import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { LanguagePicker } from "../../common/language-picker/language-picker";
import { Logo } from "../../common/logo/logo";
import { ThemeToggler } from "../../common/theme-toggler/theme-toggler";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    TranslocoDirective,
    Logo,
    ThemeToggler,
    LanguagePicker,
  ],
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

    app-logo {
      // Push the actions right without stretching the link's clickable area across the gap.
      margin-right: auto;
    }
  `,
  template: `
    <mat-toolbar>
      <div class="navbar__inner">
        <app-logo />

        <ng-container *transloco="let t; prefix: 'navbar'">
          <a matButton routerLink="/login">{{ t("login") }}</a>
          <a matButton="filled" routerLink="/register">{{ t("register") }}</a>
        </ng-container>
        <app-theme-toggler />
        <app-language-picker />
      </div>
    </mat-toolbar>
  `,
})
export class Navbar {}
