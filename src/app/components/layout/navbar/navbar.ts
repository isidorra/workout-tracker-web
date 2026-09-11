import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { authFeature } from "../../../auth/auth-feature";
import { LanguagePicker } from "../../common/language-picker/language-picker";
import { Logo } from "../../common/logo/logo";
import { ThemeToggler } from "../../common/theme-toggler/theme-toggler";
import { UserMenu } from "../user-menu/user-menu";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
    Logo,
    ThemeToggler,
    LanguagePicker,
    UserMenu,
  ],
  selector: "app-navbar",
  styles: `
    @use "@angular/material" as mat;

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 5;
      height: 62px;
      padding: 0;
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

    .navbar__start {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-right: auto;
    }

    .navbar__links {
      display: flex;
      gap: 4px;

      @include mat.button-overrides(
        (
          text-label-text-color: var(--mat-sys-on-surface-variant),
        )
      );
    }

    .navbar__link--active {
      background: var(--mat-sys-surface-container);

      @include mat.button-overrides(
        (
          text-label-text-color: var(--mat-sys-on-surface),
        )
      );
    }
  `,
  template: `
    <mat-toolbar>
      <div class="navbar__inner">
        <div class="navbar__start">
          <app-logo />

          @if (isAuthenticated()) {
            <nav *transloco="let t; prefix: 'navbar'" class="navbar__links">
              <a
                matButton
                routerLink="/"
                routerLinkActive="navbar__link--active"
                ariaCurrentWhenActive="page"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                {{ t("dashboard") }}
              </a>
              <a
                matButton
                routerLink="/workouts"
                routerLinkActive="navbar__link--active"
                ariaCurrentWhenActive="page"
              >
                {{ t("workouts") }}
              </a>
            </nav>
          }
        </div>

        @if (!isAuthenticated()) {
          <ng-container *transloco="let t; prefix: 'navbar'">
            <a matButton routerLink="/login">{{ t("login") }}</a>
            <a matButton="filled" routerLink="/register">{{ t("register") }}</a>
          </ng-container>
        }
        <app-theme-toggler />
        <app-language-picker />
        @if (isAuthenticated()) {
          <app-user-menu />
        }
      </div>
    </mat-toolbar>
  `,
})
export class Navbar {
  protected readonly isAuthenticated = inject(Store).selectSignal(
    authFeature.selectIsAuthenticated,
  );
}
