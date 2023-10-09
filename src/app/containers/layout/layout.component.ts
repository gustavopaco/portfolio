import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {UiService} from "../../shared/services/default/ui.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, FooterComponent, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  isShowNavbar = true;
  isShowFooter = true;
  isShowSideNav = false;

  isLgScreen: boolean = false;

  constructor(private uiService: UiService,
              private breakPointObserver: BreakpointObserver) {
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
    this.breakPointObserver.observe(['(min-width: 768px)'])
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isLgScreen = result.breakpoints['(min-width: 768px)'];
      })
  }

  toggleSideNav(sideNav: boolean) {
    this.isShowSideNav = sideNav;
  }

  public layoutClassStyle(): string {
    if (!this.isShowNavbar && !this.isShowFooter) {
      return 'incomplete-layout';
    }
    if ((this.isShowNavbar && !this.isShowFooter) || (!this.isShowNavbar && this.isShowFooter)) {
      return 'parcial-layout';
    }
    return 'complete-layout';
  }

  onLogout($event: boolean) {
    console.log('Deslogar? ', $event);
  }

  resetMatTab($event: boolean) {
    this.uiService.resetMatTabEventEmitter($event);
  }
}
