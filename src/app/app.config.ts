import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from "@angular/core";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import { provideRouter } from "@angular/router";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { routes } from "./app.routes";
import { authInterceptor } from "./auth/auth-interceptor";
import { provideAuth } from "./auth/provide-auth";
import { provideI18n } from "./i18n/provide-i18n";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // HttpClient works without this, but interceptors only run when registered through it.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    isDevMode() ? provideStoreDevtools({ maxAge: 25 }) : [],
    provideI18n(),
    provideAuth(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      // Every field in the app's forms is required, so the asterisk would only add noise.
      useValue: {
        appearance: "outline",
        hideRequiredMarker: true,
      } satisfies MatFormFieldDefaultOptions,
    },
  ],
};
