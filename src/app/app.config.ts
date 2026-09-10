import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideI18n } from "./i18n/provide-i18n";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideI18n(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" } satisfies MatFormFieldDefaultOptions,
    },
  ],
};
