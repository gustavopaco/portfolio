import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {CamelCasePipe} from "../../shared/pipe/camel-case.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UiService} from "../../shared/services/default/ui.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, RouterOutlet, CamelCasePipe, MatButtonModule, MatTooltipModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  links = ['skills', 'projects']
  activeLink?: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private uiService: UiService) {
    this.uiService.isResetMatTabEventEmitter
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (value) {
          this.activeLink = undefined;
        }
      });
  }

  goToRoute(link: string) {
    this.activeLink = link;
    this.router.navigate([link], {relativeTo: this.activatedRoute, onSameUrlNavigation: undefined})
  }
}
