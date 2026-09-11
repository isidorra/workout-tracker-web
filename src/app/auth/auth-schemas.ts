import {
  SchemaPath,
  email,
  maxLength,
  minLength,
  required,
  requiredError,
  schema,
  validate,
} from "@angular/forms/signals";
import { LoginRequest, RegisterRequest } from "./auth-models";

// Mirrors the API's FluentValidation rules so invalid input never leaves the browser.
export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 256;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// Rules are declared in the order their errors should surface, since pages show the first one.
export const loginSchema = schema<LoginRequest>((path) => {
  required(path.email);
  email(path.email);
  maxLength(path.email, EMAIL_MAX_LENGTH);

  notBlank(path.password);
});

export const registerSchema = schema<RegisterRequest>((path) => {
  notBlank(path.name);
  maxLength(path.name, NAME_MAX_LENGTH);

  required(path.email);
  email(path.email);
  maxLength(path.email, EMAIL_MAX_LENGTH);

  notBlank(path.password);
  minLength(path.password, PASSWORD_MIN_LENGTH);
  maxLength(path.password, PASSWORD_MAX_LENGTH);
});

/** Like `required()`, but also rejects whitespace-only values, as the API's `NotEmpty()` does. */
function notBlank(path: SchemaPath<string>): void {
  required(path);
  validate(path, ({ value }) =>
    value() !== "" && value().trim() === "" ? requiredError() : undefined,
  );
}
