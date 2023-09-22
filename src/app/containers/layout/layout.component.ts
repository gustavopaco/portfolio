import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {UiService} from "../../shared/services/ui.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  isShowNavbar = true;
  isShowFooter = true;

  constructor(private uiService: UiService) {
    this.uiService.isShowNavBarEventEmitter
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
      this.isShowNavbar = value;
    });
    this.uiService.isShowFooterEventEmitter
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
      this.isShowFooter = value;
    });
  }
}
