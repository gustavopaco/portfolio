import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {UiService} from "../../shared/services/default/ui.service";
import {SocialComponent} from "../../components/social/social.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatToolbarModule, SocialComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input('lgScreen') isLgScreen = false;

  constructor(private uiService: UiService) {
  }

  scrollToElement(element: string) {
    this.uiService.scrollToElement(element);
  }
}
