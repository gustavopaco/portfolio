import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import {LanguagePipe} from "../../shared/pipe/language.pipe";
import {StickyDirective} from "../../shared/diretivas/sticky.directive";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive, TranslateModule, MatMenuModule, MatRadioModule, LanguagePipe, StickyDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input('lgScreen') isLgScreen: boolean = false;
  @Input('userLogged') isUserLoggedIn = false;
  @Input() currentLanguage?: string;
  @Output() sideNav = new EventEmitter(false);
  @Output() logout = new EventEmitter(false);
  @Output() matTab = new EventEmitter(false);
  @Output() onChangeLanguage = new EventEmitter(false);

  languages: string[] = ['pt', 'en']

  isShowSideNav = false;

  onLogout() {
    this.logout.emit(true);
  }

  onSideNav() {
    this.isShowSideNav = !this.isShowSideNav;
    this.sideNav.emit(this.isShowSideNav);
  }

  resetMatTab() {
    this.matTab.emit(true);
  }

  changeLanguage(lang: string) {
    this.onChangeLanguage.emit(lang);
  }
}
