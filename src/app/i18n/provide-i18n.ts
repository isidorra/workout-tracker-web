import { registerLocaleData } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import localeSrLatn from "@angular/common/locales/sr-Latn";
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
    return this.http.get<Translation>(`i18n/${lang}.json`);
  }
}

export function provideI18n(): EnvironmentProviders {
  registerLocaleData(localeSrLatn);

  return makeEnvironmentProviders([
    ...provideTransloco({
      config: {
        availableLangs: LANGUAGES.map(({ id }) => id),
        defaultLang: "en",
        fallbackLang: "en",
        reRenderOnLangChange: true,
      },
      loader: TranslationLoader,
    }),
    provideAppInitializer(() => inject(Language).preload()),
  ]);
}
