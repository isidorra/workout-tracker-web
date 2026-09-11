import { Routes } from "@angular/router";
import { provideWorkouts } from "../../workouts/provide-workouts";

export const workoutsRoutes: Routes = [
  {
    path: "",
    providers: [provideWorkouts()],
    loadComponent: () => import("./workouts-page").then((m) => m.WorkoutsPage),
  },
];
