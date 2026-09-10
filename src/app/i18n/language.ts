import { DOCUMENT, Injectable, computed, effect, inject } from "@angular/core";
import { TranslocoService, getBrowserLang } from "@jsverse/transloco";
import { lastValueFrom } from "rxjs";

export const LANGUAGES = [
  { id: "en", label: "English", htmlLang: "en" },
  { id: "sr", label: "Srpski", htmlLang: "sr-Latn" },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

const STORAGE_KEY = "workout-tracker.language";

/**
 * Chooses, persists and exposes the UI language. Transloco's active language is the source of
 * truth because Transloco can switch it by itself (to English when a file fails to load).
 *
 * The first visit follows the browser language; an explicit choice is persisted.
 */
@Injectable({ providedIn: "root" })
export class Language {
  private readonly document = inject(DOCUMENT);
  private readonly transloco = inject(TranslocoService);

  readonly current = computed(
    () => LANGUAGES.find(({ id }) => id === this.transloco.activeLang()) ?? LANGUAGES[0],
  );

  constructor() {
    effect(() => {
      // Screen readers pick pronunciation from <html lang>; "sr-Latn" also pins the script.
      this.document.documentElement.lang = this.current().htmlLang;
    });
  }

  use(id: LanguageId): void {
    this.transloco.setActiveLang(id);
    this.store(id);
  }

  /** Activates the starting language and waits for its file, so the first render is translated. */
  async preload(): Promise<void> {
    const id = this.restore();
    this.transloco.setActiveLang(id);

    try {
      await lastValueFrom(this.transloco.load(id));
    } catch {
      // A missing translation file should degrade the copy, not leave a blank page.
    }
  }

  private restore(): LanguageId {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      const match = LANGUAGES.find(({ id }) => id === stored);

      if (match) {
        return match.id;
      }
    } catch {
      // Storage is unavailable in some privacy modes; fall back to the browser language.
    }

    // getBrowserLang() drops the region and script, so "sr-Latn-RS" still matches.
    return getBrowserLang() === "sr" ? "sr" : "en";
  }

  private store(id: LanguageId): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Storage is unavailable in some privacy modes; the choice still applies for this session.
    }
  }
}
