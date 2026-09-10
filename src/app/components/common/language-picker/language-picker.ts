import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { TranslocoDirective } from "@jsverse/transloco";
import { LANGUAGES, Language } from "../../../i18n/language";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, TranslocoDirective],
  selector: "app-language-picker",
  template: `
    <ng-container *transloco="let t; prefix: 'languagePicker'">
      <button matIconButton type="button" [attr.aria-label]="t('label')" [matMenuTriggerFor]="menu">
        <mat-icon>translate</mat-icon>
      </button>

      <mat-menu #menu="matMenu" xPosition="before" [aria-label]="t('label')">
        @for (option of languages; track option.id) {
          @let active = option.id === language.current().id;

          <button
            mat-menu-item
            type="button"
            role="menuitemradio"
            [attr.aria-checked]="active"
            [attr.lang]="option.htmlLang"
            (click)="language.use(option.id)"
          >
            <mat-icon>{{ active ? "check" : "" }}</mat-icon>
            {{ option.label }}
          </button>
        }
      </mat-menu>
    </ng-container>
  `,
})
export class LanguagePicker {
  protected readonly language = inject(Language);
  protected readonly languages = LANGUAGES;
}
