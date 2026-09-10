import { DOCUMENT, Injectable, computed, effect, inject, signal } from "@angular/core";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "workout-tracker.theme";

/**
 * Drives the app's light/dark theme by setting `color-scheme` on the document root, which is what
 * the `light-dark()` values emitted by `mat.theme()` resolve against.
 *
 * The default mode follows the operating system; an explicit choice is persisted and pinned with a
 * `data-theme` attribute.
 */
@Injectable({ providedIn: "root" })
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly systemPrefersDark = signal(false);

  readonly mode = signal<ThemeMode>(this.restoreMode());

  readonly isDark = computed(() =>
    this.mode() === "system" ? this.systemPrefersDark() : this.mode() === "dark",
  );

  constructor() {
    const query = this.document.defaultView?.matchMedia("(prefers-color-scheme: dark)");

    if (query) {
      this.systemPrefersDark.set(query.matches);
      query.addEventListener("change", (event) => this.systemPrefersDark.set(event.matches));
    }

    effect(() => {
      const mode = this.mode();
      const root = this.document.documentElement;

      // No attribute means "follow the OS", which is what the base `color-scheme: light dark` does.
      if (mode === "system") {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", mode);
      }

      this.storeMode(mode);
    });
  }

  /** Flips to the opposite of whatever is currently showing, including when following the OS. */
  toggle(): void {
    this.mode.set(this.isDark() ? "light" : "dark");
  }

  private restoreMode(): ThemeMode {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return stored === "light" || stored === "dark" ? stored : "system";
    } catch {
      return "system";
    }
  }

  private storeMode(mode: ThemeMode): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage is unavailable in some privacy modes; the theme still works for this session.
    }
  }
}
