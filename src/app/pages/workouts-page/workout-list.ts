import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
} from "@angular/material/expansion";
import { Workout } from "../../workouts/workouts-models";
import { WorkoutDetails } from "./workout-details";
import { WorkoutSummary } from "./workout-summary";

/**
 * Workouts as collapsible rows, one open at a time. The panels live in this template rather than in
 * a row component because the accordion finds headers through a content query, and it needs them to
 * move focus between rows with the arrow keys.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    WorkoutSummary,
    WorkoutDetails,
  ],
  selector: "app-workout-list",
  styles: `
    @use "@angular/material" as mat;

    :host {
      display: block;

      // The rows share the surrounding card's surface, shadow and corners, so panels bring none.
      @include mat.expansion-overrides(
        (
          container-shape: 0,
          container-elevation-shadow: none,
          header-collapsed-state-height: auto,
          header-expanded-state-height: auto,
          header-indicator-color: var(--app-ink-3),
        )
      );
    }

    mat-accordion {
      display: block;
    }

    mat-expansion-panel + mat-expansion-panel {
      border-top: 1px solid var(--app-line);
    }

    // With auto heights the padding sets the row height, so a wrapped date is never clipped.
    mat-expansion-panel-header {
      padding: 14px 24px;
    }

    @media (max-width: 599px) {
      mat-expansion-panel-header {
        padding: 12px 12px 12px 16px;
      }
    }
  `,
  // Flat mode keeps an open row flush with its neighbours instead of spacing it out. The details
  // template renders on first open only.
  template: `
    <mat-accordion displayMode="flat">
      @for (workout of workouts(); track workout.id) {
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <app-workout-summary [workout]="workout" />
          </mat-expansion-panel-header>

          <ng-template matExpansionPanelContent>
            <app-workout-details [workout]="workout" />
          </ng-template>
        </mat-expansion-panel>
      }
    </mat-accordion>
  `,
})
export class WorkoutList {
  readonly workouts = input.required<Workout[]>();
}
