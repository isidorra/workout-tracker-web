import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "./components/layout/navbar/navbar";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, RouterOutlet],
  selector: "app-root",
  styles: `
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
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
