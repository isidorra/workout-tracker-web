import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { AuthCard } from "../../components/layout/auth-card/auth-card";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthCard, MatFormField, MatLabel, MatInput, MatButton, RouterLink],
  selector: "app-login-page",
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
      heading="Welcome back"
      description="Sign in to log workouts and check your progress."
    >
      <form novalidate (submit)="$event.preventDefault()">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" autocomplete="email" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" autocomplete="current-password" />
        </mat-form-field>

        <button matButton="filled" type="submit">Sign in</button>
      </form>

      <ng-container authCardFooter>
        New here?
        <a matButton routerLink="/register">Create an account</a>
      </ng-container>
    </app-auth-card>
  `,
})
export class LoginPage {}
