import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
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
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
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
      overflow: hidden;
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
      min-width: 0;
      margin-right: auto;
    }

    .navbar__end {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      gap: 2px;
    }

    .navbar__links,
    .navbar__auth {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .navbar__links {
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

    .navbar__menu-button {
      display: none;
    }

    @media (max-width: 839px) {
      .navbar__inner {
        padding: 0 8px 0 16px;
      }

      .navbar__links--desktop,
      .navbar__auth--desktop {
        display: none;
      }

      .navbar__menu-button {
        display: inline-flex;
      }
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'navbar'">
      <mat-toolbar>
        <div class="navbar__inner">
          <div class="navbar__start">
            <app-logo />

            @if (isAuthenticated()) {
              <nav class="navbar__links navbar__links--desktop">
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

          <div class="navbar__end">
            @if (!isAuthenticated()) {
              <div class="navbar__auth navbar__auth--desktop">
                <a matButton routerLink="/login">{{ t("login") }}</a>
                <a matButton="filled" routerLink="/register">{{ t("register") }}</a>
              </div>
            }
            <app-theme-toggler />
            <app-language-picker />
            @if (isAuthenticated()) {
              <app-user-menu />
            }
            <button
              matIconButton
              type="button"
              class="navbar__menu-button"
              [attr.aria-label]="t('menu')"
              [matMenuTriggerFor]="menu"
            >
              <mat-icon>menu</mat-icon>
            </button>
          </div>
        </div>
      </mat-toolbar>

      <mat-menu #menu="matMenu" xPosition="before" [aria-label]="t('menu')">
        @if (isAuthenticated()) {
          <a
            mat-menu-item
            routerLink="/"
            routerLinkActive="navbar__link--active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <mat-icon>dashboard</mat-icon>
            {{ t("dashboard") }}
          </a>
          <a mat-menu-item routerLink="/workouts" routerLinkActive="navbar__link--active">
            <mat-icon>fitness_center</mat-icon>
            {{ t("workouts") }}
          </a>
        } @else {
          <a mat-menu-item routerLink="/login">
            <mat-icon>login</mat-icon>
            {{ t("login") }}
          </a>
          <a mat-menu-item routerLink="/register">
            <mat-icon>person_add</mat-icon>
            {{ t("register") }}
          </a>
        }
      </mat-menu>
    </ng-container>
  `,
})
export class Navbar {
  protected readonly isAuthenticated = inject(Store).selectSignal(
    authFeature.selectIsAuthenticated,
  );
}
