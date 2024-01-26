import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {UiService} from "../../shared/services/default/ui.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AuthService} from "../../shared/services/default/auth.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {StickyDirective} from "../../shared/diretivas/sticky.directive";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, FooterComponent, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, RouterLink, RouterLinkActive, TranslateModule, StickyDirective],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  isShowNavbar = true;
  isShowFooter = true;
  isShowSideNav = false;
  isUserLoggedIn = false;

  isLgScreen: boolean = false;
  currentLanguage?: string;

  constructor(private uiService: UiService,
              private authService: AuthService,
              private translateService: TranslateService,
              private breakPointObserver: BreakpointObserver) {
    this.authService.defaultLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe((value: string) => {
        this.currentLanguage = value;
        this.translateService.use(value);
      });
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
        if (this.isLgScreen) {
          this.hideSideNav();
        }
      });
    this.isUserLoggedIn = authService.isUserLogged();
  }

  toggleSideNav(sideNav: boolean) {
    this.isShowSideNav = sideNav;
  }

  private hideSideNav() {
    this.isShowSideNav = false;
  }

  public layoutClassStyle(): string {
    if (!this.isShowNavbar && !this.isShowFooter) {
      return 'empty-layout';
    }
    if (this.isShowNavbar && !this.isShowFooter) {
      return 'navbar-layout';
    }
    if (!this.isShowNavbar && this.isShowFooter) {
      return 'footer-layout';
    }
    return 'complete-layout';
  }

  onLogout($event: boolean) {
    if ($event) this.authService.logout();
  }

  resetMatTab($event: boolean) {
    this.uiService.resetMatTabEventEmitter($event);
  }

  defineLanguage($event: string) {
    this.authService.saveCurrentLanguage($event);
  }
}
