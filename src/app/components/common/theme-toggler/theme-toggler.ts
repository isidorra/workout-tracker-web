import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { Theme } from "../../../theme/theme";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon],
  selector: "app-theme-toggler",
  template: `
    <button
      matIconButton
      type="button"
      [attr.aria-label]="theme.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
      (click)="theme.toggle()"
    >
      <mat-icon>{{ theme.isDark() ? "light_mode" : "dark_mode" }}</mat-icon>
    </button>
  `,
})
export class ThemeToggler {
  protected readonly theme = inject(Theme);
}
