import { HttpClient } from "@angular/common/http";
import {
  EnvironmentProviders,
  Injectable,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from "@angular/core";
import { Translation, TranslocoLoader, provideTransloco } from "@jsverse/transloco";
import { Observable } from "rxjs";
import { LANGUAGES, Language } from "./language";

@Injectable()
class TranslationLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    // Relative, so it resolves against <base href> and keeps working under a sub-path deploy.
    return this.http.get<Translation>(`i18n/${lang}.json`);
  }
}

export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...provideTransloco({
      config: {
        availableLangs: LANGUAGES.map(({ id }) => id),
        defaultLang: "en",
        // If a language file fails to load, Transloco switches to English instead of throwing.
        fallbackLang: "en",
        reRenderOnLangChange: true,
      },
      loader: TranslationLoader,
    }),
    // Holds bootstrap until the starting language is loaded, so nothing renders untranslated.
    provideAppInitializer(() => inject(Language).preload()),
  ]);
}
