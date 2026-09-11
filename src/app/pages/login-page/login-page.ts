import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, FormRoot, form } from "@angular/forms/signals";
import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { AuthActions } from "../../auth/auth-actions";
import { authFeature } from "../../auth/auth-feature";
import { LoginRequest } from "../../auth/auth-models";
import { loginSchema } from "../../auth/auth-schemas";
import { FieldError } from "../../components/common/field-error/field-error";
import { PasswordToggle } from "../../components/common/password-toggle/password-toggle";
import { AuthCard } from "../../components/layout/auth-card/auth-card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AuthCard,
    FieldError,
    PasswordToggle,
    FormField,
    FormRoot,
    MatFormField,
    MatLabel,
    MatError,
    MatSuffix,
    MatInput,
    MatButton,
    RouterLink,
    TranslocoDirective,
  ],
  selector: "app-login-page",
  styles: `
    :host {
      display: flex;
      flex: 1;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `,
  template: `
    <app-auth-card
      *transloco="let t; prefix: 'loginPage'"
      [heading]="t('heading')"
      [description]="t('description')"
    >
      <form [formRoot]="loginForm">
        <mat-form-field>
          <mat-label>{{ t("email") }}</mat-label>
          <input matInput type="email" autocomplete="email" [formField]="loginForm.email" />
          @if (loginForm.email().errors()[0]; as error) {
            <mat-error><app-field-error [error]="error" /></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ t("password") }}</mat-label>
          <input
            matInput
            autocomplete="current-password"
            [type]="passwordToggle.type()"
            [formField]="loginForm.password"
          />
          <app-password-toggle #passwordToggle matIconSuffix />
          @if (loginForm.password().errors()[0]; as error) {
            <mat-error><app-field-error [error]="error" /></mat-error>
          }
        </mat-form-field>

        <button matButton="filled" type="submit" [disabled]="pending()">{{ t("submit") }}</button>
      </form>

      <ng-container authCardFooter>
        {{ t("footerPrompt") }}
        <a matButton routerLink="/register">{{ t("footerLink") }}</a>
      </ng-container>
    </app-auth-card>
  `,
})
export class LoginPage {
  private readonly store = inject(Store);
  private readonly model = signal<LoginRequest>({ email: "", password: "" });

  protected readonly pending = this.store.selectSignal(authFeature.selectPending);

  protected readonly loginForm = form(this.model, loginSchema, {
    submission: {
      // Only runs once every field is valid; submitting also marks all fields touched, which is
      // what reveals their errors.
      action: async () => {
        this.store.dispatch(AuthActions.login(this.model()));
      },
    },
  });
}
