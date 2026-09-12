import { Routes } from "@angular/router";
import { authGuard } from "./auth/auth-guard";
import { guestGuard } from "./auth/guest-guard";
import { provideDashboard } from "./dashboard/provide-dashboard";
import { provideWorkouts } from "./workouts/provide-workouts";

export const routes: Routes = [
  {
    path: "",
    providers: [provideDashboard(), provideWorkouts()],
    loadComponent: () => import("./pages/home-page/home-page").then((m) => m.HomePage),
  },
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () => import("./pages/login-page/login-page").then((m) => m.LoginPage),
  },
  {
    path: "register",
    canActivate: [guestGuard],
    loadComponent: () => import("./pages/register-page/register-page").then((m) => m.RegisterPage),
  },
  {
    path: "workouts",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./pages/workouts-page/workouts.routes").then((m) => m.workoutsRoutes),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/not-found-page/not-found-page").then((m) => m.NotFoundPage),
  },
];
