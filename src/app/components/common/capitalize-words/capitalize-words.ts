import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "input[appCapitalizeWords]",
  host: { autocapitalize: "words" },
})
export class CapitalizeWords {
  private readonly input = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  constructor() {
    this.input.addEventListener(
      "input",
      (event) => {
        if (!(event instanceof InputEvent && event.isComposing)) {
          this.capitalize();
        }
      },
      { capture: true },
    );

    this.input.addEventListener("compositionend", () => {
      if (this.capitalize()) {
        this.input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }

  private capitalize(): boolean {
    const { value, selectionStart, selectionEnd, selectionDirection } = this.input;
    const capitalized = value.replace(/(^|\s)\S/g, (match) => match.toUpperCase());

    if (capitalized === value) {
      return false;
    }

    this.input.value = capitalized;
    this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection ?? undefined);
    return true;
  }
}
