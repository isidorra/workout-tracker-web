import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

/** First letters of the first and last words of a name, e.g. "Ana Marić" → "AM". */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  // Spread by code point so a leading character outside the BMP is not split in half.
  const first = [...words[0]][0];
  const last = words.length > 1 ? [...words[words.length - 1]][0] : "";

  return (first + last).toUpperCase();
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-avatar",
  styles: `
    :host {
      display: inline-flex;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      font-family: var(--app-font-condensed);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;
      line-height: 1;
    }
  `,
  // Decorative: the button that hosts the avatar carries the accessible name.
  template: `<span class="avatar" aria-hidden="true">{{ initials() }}</span>`,
})
export class Avatar {
  readonly name = input.required<string>();

  protected readonly initials = computed(() => initialsOf(this.name()));
}
