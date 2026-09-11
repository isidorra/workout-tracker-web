import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Paged } from "../shared/paged";
import { Workout, WorkoutInput, WorkoutsListQuery } from "./workouts-models";

@Injectable({ providedIn: "root" })
export class WorkoutsApi {
  private readonly http = inject(HttpClient);

  /** One page of the signed-in user's workouts, newest first. */
  list(query: WorkoutsListQuery): Observable<Paged<Workout>> {
    let params = new HttpParams().set("page", query.page).set("pageSize", query.pageSize);

    if (query.type !== null) {
      params = params.set("type", query.type);
    }

    return this.http.get<Paged<Workout>>("/api/workouts", { params });
  }

  /** Saves a workout for the signed-in user; the API answers with it as a list item. */
  create(input: WorkoutInput): Observable<Workout> {
    return this.http.post<Workout>("/api/workouts", input);
  }
}
