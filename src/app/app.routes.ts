import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home-page/home-page").then((m) => m.HomePage),
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login-page/login-page").then((m) => m.LoginPage),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register-page/register-page").then((m) => m.RegisterPage),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/not-found-page/not-found-page").then((m) => m.NotFoundPage),
  },
];
