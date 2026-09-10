import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { AuthCard } from "../../components/layout/auth-card/auth-card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthCard, MatFormField, MatLabel, MatInput, MatButton, RouterLink],
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
      heading="Create account"
      description="Create an account to start tracking your workouts."
    >
      <form novalidate (submit)="$event.preventDefault()">
        <mat-form-field>
          <mat-label>Your name</mat-label>
          <input matInput autocomplete="name" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" autocomplete="email" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" autocomplete="new-password" />
        </mat-form-field>

        <button matButton="filled" type="submit">Create account</button>
      </form>

      <ng-container authCardFooter>
        Already have an account?
        <a matButton routerLink="/login">Sign in</a>
      </ng-container>
    </app-auth-card>
  `,
})
export class RegisterPage {}
