import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input('lgScreen') isLgScreen: boolean = false;
  @Output() sideNav = new EventEmitter(false);
  @Output() logout = new EventEmitter(false);
  @Output() matTab = new EventEmitter(false);
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
}
