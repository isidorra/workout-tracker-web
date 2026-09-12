import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "./components/layout/navbar/navbar";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, RouterOutlet],
  selector: "app-root",
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    main {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      box-sizing: border-box;
      width: 100%;
      max-width: 1248px;
      margin: 0 auto;
      padding: 24px;
      overflow: auto;
    }

    @media (max-width: 599px) {
      main {
        padding: 16px;
      }
    }
  `,
  template: `
    <app-navbar />

    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
