import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, FormRoot, form } from "@angular/forms/signals";
import { MatButton } from "@angular/material/button";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { TranslocoDirective } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { AuthActions } from "../../auth/auth-actions";
import { authFeature } from "../../auth/auth-feature";
import { RegisterRequest } from "../../auth/auth-models";
import { registerSchema } from "../../auth/auth-schemas";
import { FieldError } from "../../components/common/field-error/field-error";
import { AuthCard } from "../../components/layout/auth-card/auth-card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AuthCard,
    FieldError,
    FormField,
    FormRoot,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    RouterLink,
    TranslocoDirective,
  ],
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
      <form [formRoot]="registerForm">
        <mat-form-field>
          <mat-label>{{ t("name") }}</mat-label>
          <input matInput autocomplete="name" [formField]="registerForm.name" />
          @if (registerForm.name().errors()[0]; as error) {
            <mat-error><app-field-error [error]="error" /></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ t("email") }}</mat-label>
          <input matInput type="email" autocomplete="email" [formField]="registerForm.email" />
          @if (registerForm.email().errors()[0]; as error) {
            <mat-error><app-field-error [error]="error" /></mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ t("password") }}</mat-label>
          <input
            matInput
            type="password"
            autocomplete="new-password"
            [formField]="registerForm.password"
          />
          @if (registerForm.password().errors()[0]; as error) {
            <mat-error><app-field-error [error]="error" /></mat-error>
          }
        </mat-form-field>

        <button matButton="filled" type="submit" [disabled]="pending()">{{ t("submit") }}</button>
      </form>

      <ng-container authCardFooter>
        {{ t("footerPrompt") }}
        <a matButton routerLink="/login">{{ t("footerLink") }}</a>
      </ng-container>
    </app-auth-card>
  `,
})
export class RegisterPage {
  private readonly store = inject(Store);
  private readonly model = signal<RegisterRequest>({ name: "", email: "", password: "" });

  protected readonly pending = this.store.selectSignal(authFeature.selectPending);

  protected readonly registerForm = form(this.model, registerSchema, {
    submission: {
      // Only runs once every field is valid; submitting also marks all fields touched, which is
      // what reveals their errors.
      action: async () => {
        this.store.dispatch(AuthActions.register(this.model()));
      },
    },
  });
}
