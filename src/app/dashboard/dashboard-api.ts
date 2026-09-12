import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardProgress, DashboardSummary, ProgressMonth } from "./dashboard-models";

@Injectable({ providedIn: "root" })
export class DashboardApi {
  private readonly http = inject(HttpClient);

  /** Today and this-week totals for the signed-in user, using their local calendar date. */
  get(today: string): Observable<DashboardSummary> {
    const params = new HttpParams().set("today", today);

    return this.http.get<DashboardSummary>("/api/dashboard", { params });
  }

  /** Weekly totals for every Monday–Sunday week that intersects the given month. */
  getProgress(month: ProgressMonth): Observable<DashboardProgress> {
    const params = new HttpParams().set("year", month.year).set("month", month.month);

    return this.http.get<DashboardProgress>("/api/dashboard/progress", { params });
  }
}
