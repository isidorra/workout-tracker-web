import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormField, FormRoot, form } from "@angular/forms/signals";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatError, MatFormField, MatHint, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Store } from "@ngrx/store";
import { FieldError } from "../../components/common/field-error/field-error";
import { WorkoutDialogActions } from "../../workouts/workouts-actions";
import { workoutsFeature } from "../../workouts/workouts-feature";
import {
  WORKOUT_TYPES,
  WORKOUT_TYPE_KEYS,
  initialWorkoutFormModel,
  toWorkoutInput,
} from "../../workouts/workouts-models";
import { NOTES_MAX_LENGTH, workoutSchema } from "../../workouts/workouts-schemas";
import { RatingPicker } from "./rating-picker";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkTextareaAutosize,
    FieldError,
    FormField,
    FormRoot,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    RatingPicker,
    TranslocoDirective,
    TranslocoPipe,
  ],
  selector: "app-workout-dialog",
  styles: `
    @use "@angular/material" as mat;

    :host {
      --workout-dialog-gutter: 40px;

      @include mat.dialog-overrides(
        (
          subhead-font: var(--app-font-condensed),
          subhead-size: 28px,
          subhead-line-height: 1,
          subhead-weight: 700,
          subhead-tracking: 0,
          supporting-text-color: var(--mat-sys-on-surface),
          with-actions-content-padding: 28px var(--workout-dialog-gutter),
          actions-padding: 20px var(--workout-dialog-gutter),
        )
      );
    }

    @media (max-width: 599px) {
      :host {
        --workout-dialog-gutter: 20px;
      }
    }

    .workout-dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 16px 20px var(--workout-dialog-gutter);
      border-bottom: 1px solid var(--app-line);
    }

    .workout-dialog__title {
      margin: 0;
      padding: 0;
      text-transform: uppercase;
    }

    .workout-dialog__title::before {
      display: none;
    }

    .workout-dialog__section + .workout-dialog__section {
      margin-top: 24px;
    }

    .workout-dialog__heading {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 0 14px;
      font: var(--mat-sys-title-medium);
    }

    .workout-dialog__step {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      font-family: var(--app-font-condensed);
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
    }

    .workout-dialog__types {
      display: flex;
    }

    .workout-dialog__types mat-button-toggle {
      flex: 1;
      min-width: 0;
    }

    .workout-dialog__fields {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      column-gap: 12px;
    }

    @media (max-width: 599px) {
      .workout-dialog__fields {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .workout-dialog__ratings {
      display: grid;
      gap: 20px;
      margin-bottom: 20px;
    }

    .workout-dialog__calories,
    .workout-dialog__notes {
      width: 100%;
    }

    .workout-dialog__calories {
      margin-bottom: 20px;
    }

    .workout-dialog__error {
      margin: 6px 0 0;
      color: var(--mat-sys-error);
      font: var(--mat-sys-body-small);
    }

    .workout-dialog__actions {
      border-top: 1px solid var(--app-line);
    }
  `,

  template: `
    <ng-container *transloco="let t; prefix: 'workoutDialog'">
      <div class="workout-dialog__header">
        <h2 mat-dialog-title class="workout-dialog__title">{{ t("title") }}</h2>
        <button matIconButton type="button" mat-dialog-close [attr.aria-label]="t('close')">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formRoot]="workoutForm">
        <mat-dialog-content>
          <section class="workout-dialog__section">
            <h3 class="workout-dialog__heading">
              <span class="workout-dialog__step" aria-hidden="true">1</span>
              {{ t("sectionWhat") }}
            </h3>

            <mat-button-toggle-group
              class="workout-dialog__types app-segmented"
              hideSingleSelectionIndicator
              [attr.aria-label]="t('type')"
              [formField]="workoutForm.type"
            >
              @for (option of typeOptions; track option.value) {
                <mat-button-toggle [value]="option.value">
                  {{ option.nameKey | transloco }}
                </mat-button-toggle>
              }
            </mat-button-toggle-group>
            @if (workoutForm.type().touched() && workoutForm.type().errors()[0]; as error) {
              <p class="workout-dialog__error"><app-field-error [error]="error" /></p>
            }
          </section>

          <section class="workout-dialog__section">
            <h3 class="workout-dialog__heading">
              <span class="workout-dialog__step" aria-hidden="true">2</span>
              {{ t("sectionWhen") }}
            </h3>

            <div class="workout-dialog__fields">
              <mat-form-field>
                <mat-label>{{ t("date") }}</mat-label>
                <input matInput type="date" [formField]="workoutForm.date" />
                @if (workoutForm.date().errors()[0]; as error) {
                  <mat-error><app-field-error [error]="error" /></mat-error>
                }
              </mat-form-field>

              <mat-form-field>
                <mat-label>{{ t("time") }}</mat-label>
                <input matInput type="time" [formField]="workoutForm.time" />
                @if (workoutForm.time().errors()[0]; as error) {
                  <mat-error><app-field-error [error]="error" /></mat-error>
                }
              </mat-form-field>

              <mat-form-field>
                <mat-label>{{ t("duration") }}</mat-label>
                <input
                  matInput
                  type="number"
                  inputmode="numeric"
                  autocomplete="off"
                  [formField]="workoutForm.durationMinutes"
                />
                @if (workoutForm.durationMinutes().errors()[0]; as error) {
                  <mat-error><app-field-error [error]="error" /></mat-error>
                }
              </mat-form-field>
            </div>
          </section>

          <section class="workout-dialog__section">
            <h3 class="workout-dialog__heading">
              <span class="workout-dialog__step" aria-hidden="true">3</span>
              {{ t("sectionHow") }}
            </h3>

            <div class="workout-dialog__ratings">
              <app-rating-picker
                wordsKey="workoutDialog.difficultyWords"
                [label]="t('difficulty')"
                [formField]="workoutForm.difficulty"
              />
              <app-rating-picker
                tone="heat"
                wordsKey="workoutDialog.fatigueWords"
                [label]="t('fatigue')"
                [formField]="workoutForm.fatigue"
              />
            </div>

            <mat-form-field class="workout-dialog__calories">
              <mat-label>{{ t("calories") }}</mat-label>
              <input
                matInput
                type="number"
                inputmode="numeric"
                autocomplete="off"
                [formField]="workoutForm.calories"
              />
              @if (workoutForm.calories().errors()[0]; as error) {
                <mat-error><app-field-error [error]="error" /></mat-error>
              }
            </mat-form-field>

            <mat-form-field class="workout-dialog__notes">
              <mat-label>{{ t("notes") }}</mat-label>
              <textarea
                matInput
                cdkTextareaAutosize
                cdkAutosizeMinRows="3"
                cdkAutosizeMaxRows="8"
                [placeholder]="t('notesPlaceholder')"
                [formField]="workoutForm.notes"
              ></textarea>
              <mat-hint align="end">
                {{ workoutForm.notes().value().length }} / {{ notesMaxLength }}
              </mat-hint>
              @if (workoutForm.notes().errors()[0]; as error) {
                <mat-error><app-field-error [error]="error" /></mat-error>
              }
            </mat-form-field>
          </section>
        </mat-dialog-content>

        <mat-dialog-actions align="end" class="workout-dialog__actions">
          <button matButton="outlined" type="button" mat-dialog-close>{{ t("cancel") }}</button>
          <button matButton="filled" type="submit" [disabled]="pending()">{{ t("save") }}</button>
        </mat-dialog-actions>
      </form>
    </ng-container>
  `,
})
export class WorkoutDialog {
  private readonly store = inject(Store);
  private readonly model = signal(initialWorkoutFormModel());

  protected readonly pending = this.store.selectSignal(workoutsFeature.selectPending);
  protected readonly notesMaxLength = NOTES_MAX_LENGTH;

  protected readonly typeOptions = WORKOUT_TYPES.map((type) => ({
    value: type,
    nameKey: `workoutType.${WORKOUT_TYPE_KEYS[type]}.name`,
  }));

  protected readonly workoutForm = form(this.model, workoutSchema, {
    submission: {
      action: async () => {
        this.store.dispatch(
          WorkoutDialogActions.submitted({ input: toWorkoutInput(this.model()) }),
        );
      },
    },
  });
}
