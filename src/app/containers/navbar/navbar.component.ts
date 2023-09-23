import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input('lgScreen') isLgScreen: boolean = false;
  @Output() sideNav = new EventEmitter(false);
  @Output() goTo = new EventEmitter(false);
  isShowSideNav = false;

  onGoTo(path: string) {
    this.goTo.emit(path);
  }

  onSideNav() {
    this.isShowSideNav = !this.isShowSideNav;
    this.sideNav.emit(this.isShowSideNav);
  }
}
