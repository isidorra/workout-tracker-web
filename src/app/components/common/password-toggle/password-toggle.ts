import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, TranslocoDirective],
  selector: "app-password-toggle",
  styles: `
    :host {
      display: flex;
      margin-inline-end: 6px;
    }
  `,
  template: `
    <button
      *transloco="let t; prefix: 'passwordToggle'"
      matIconButton
      type="button"
      [attr.aria-label]="t(visible() ? 'hide' : 'show')"
      (click)="toggle()"
    >
      <mat-icon>{{ visible() ? "visibility_off" : "visibility" }}</mat-icon>
    </button>
  `,
})
export class PasswordToggle {
  protected readonly visible = signal(false);

  readonly type = computed(() => (this.visible() ? "text" : "password"));

  protected toggle(): void {
    this.visible.update((visible) => !visible);
  }
}
