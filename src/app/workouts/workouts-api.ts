import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Workout, WorkoutInput } from "./workouts-models";

@Injectable({ providedIn: "root" })
export class WorkoutsApi {
  private readonly http = inject(HttpClient);

  /** Every workout of the signed-in user, newest first. */
  list(): Observable<Workout[]> {
    return this.http.get<Workout[]>("/api/workouts");
  }

  /** Saves a workout for the signed-in user; the API answers with it as `list()` would. */
  create(input: WorkoutInput): Observable<Workout> {
    return this.http.post<Workout>("/api/workouts", input);
  }
}
