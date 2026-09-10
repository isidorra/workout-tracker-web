import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { AuthCard } from "../../components/layout/auth-card/auth-card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthCard, MatFormField, MatLabel, MatInput, MatButton, RouterLink, TranslocoDirective],
  selector: "app-register-page",
  styles: `
    :host {
      display: flex;
      flex: 1;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    button[type="submit"] {
      margin-top: 8px;
    }
  `,
  template: `
    <app-auth-card
      *transloco="let t; prefix: 'registerPage'"
      [heading]="t('heading')"
      [description]="t('description')"
    >
      <form novalidate (submit)="$event.preventDefault()">
        <mat-form-field>
          <mat-label>{{ t("name") }}</mat-label>
          <input matInput autocomplete="name" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ t("email") }}</mat-label>
          <input matInput type="email" autocomplete="email" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ t("password") }}</mat-label>
          <input matInput type="password" autocomplete="new-password" />
        </mat-form-field>

        <button matButton="filled" type="submit">{{ t("submit") }}</button>
      </form>

      <ng-container authCardFooter>
        {{ t("footerPrompt") }}
        <a matButton routerLink="/login">{{ t("footerLink") }}</a>
      </ng-container>
    </app-auth-card>
  `,
})
export class RegisterPage {}
