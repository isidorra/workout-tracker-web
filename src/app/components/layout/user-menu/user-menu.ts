import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { TranslocoDirective } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { AuthActions } from "../../../auth/auth-actions";
import { authFeature } from "../../../auth/auth-feature";
import { Avatar } from "../../common/avatar/avatar";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider,
    TranslocoDirective,
    Avatar,
  ],
  selector: "app-user-menu",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: inline-flex;

      // A round state layer that hugs the avatar, instead of the square icon-button default.
      @include mat.icon-button-overrides(
        (
          container-shape: 50%,
          icon-size: 32px,
        )
      );
    }

    // Block-level, so the button's line box (as tall as its 32px font size needs) can't shift it.
    app-avatar {
      display: flex;
    }

    .user-menu__header {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 200px;
      padding: 12px 16px;
    }

    .user-menu__name {
      font: var(--mat-sys-title-small);
    }

    .user-menu__email {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }

    mat-divider {
      @include mat.menu-overrides(
        (
          divider-bottom-spacing: 0,
        )
      );
    }
  `,
  template: `
    @if (user(); as user) {
      <ng-container *transloco="let t; prefix: 'userMenu'">
        <button
          matIconButton
          type="button"
          [attr.aria-label]="t('label')"
          [matMenuTriggerFor]="menu"
        >
          <app-avatar [name]="user.name" />
        </button>

        <mat-menu #menu="matMenu" xPosition="before" [aria-label]="t('label')">
          <div class="user-menu__header">
            <span class="user-menu__name">{{ user.name }}</span>
            <span class="user-menu__email">{{ user.email }}</span>
          </div>

          <mat-divider />

          <button mat-menu-item type="button" [disabled]="pending()" (click)="logout()">
            <mat-icon>logout</mat-icon>
            {{ t("logout") }}
          </button>
        </mat-menu>
      </ng-container>
    }
  `,
})
export class UserMenu {
  private readonly store = inject(Store);

  protected readonly user = this.store.selectSignal(authFeature.selectUser);
  protected readonly pending = this.store.selectSignal(authFeature.selectPending);

  protected logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
