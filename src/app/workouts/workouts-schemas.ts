import {
  SchemaPath,
  max,
  maxLength,
  min,
  required,
  schema,
  validate,
} from "@angular/forms/signals";
import { WorkoutFormModel } from "./workouts-models";

export const DURATION_MIN_MINUTES = 1;
export const DURATION_MAX_MINUTES = 1440;
export const CALORIES_MIN = 0;
export const CALORIES_MAX = 10000;
export const NOTES_MAX_LENGTH = 1000;

export const workoutSchema = schema<WorkoutFormModel>((path) => {
  required(path.type);

  required(path.date);
  required(path.time);

  required(path.durationMinutes);
  integer(path.durationMinutes);
  min(path.durationMinutes, DURATION_MIN_MINUTES);
  max(path.durationMinutes, DURATION_MAX_MINUTES);

  required(path.calories);
  integer(path.calories);
  min(path.calories, CALORIES_MIN);
  max(path.calories, CALORIES_MAX);

  required(path.difficulty);
  required(path.fatigue);

  maxLength(path.notes, NOTES_MAX_LENGTH);
});

function integer(path: SchemaPath<number | null>): void {
  validate(path, ({ value }) =>
    value() !== null && !Number.isInteger(value()) ? { kind: "integer" } : undefined,
  );
}
