import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TranslocoDirective } from "@jsverse/transloco";
import { Theme } from "../../../theme/theme";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, TranslocoDirective],
  selector: "app-theme-toggler",
  template: `
    <button
      *transloco="let t; prefix: 'themeToggler'"
      matIconButton
      type="button"
      [attr.aria-label]="t(theme.isDark() ? 'switchToLight' : 'switchToDark')"
      (click)="theme.toggle()"
    >
      <mat-icon>{{ theme.isDark() ? "light_mode" : "dark_mode" }}</mat-icon>
    </button>
  `,
})
export class ThemeToggler {
  protected readonly theme = inject(Theme);
}
