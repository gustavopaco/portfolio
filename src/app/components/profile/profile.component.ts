import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UiService} from "../../shared/services/default/ui.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BioFormComponent} from "../bio/containers/bio-form/bio-form.component";
import {MatDividerModule} from "@angular/material/divider";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, RouterOutlet, MatButtonModule, MatTooltipModule, MatToolbarModule, BioFormComponent, MatDividerModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  links = ['skills', 'projects', 'courses', 'certificates']
  activeLink?: string;

  constructor(private router: Router,
              private translate: TranslateService,
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

  setMatTabTitle(link: string) {
    if (link === 'skills') {
      return this.translate.instant('profile.title_skills');
    }
    if (link === 'projects') {
      return this.translate.instant('profile.title_projects');
    }
    if (link === 'courses') {
      return this.translate.instant('profile.title_courses');
    }
    return this.translate.instant('profile.title_certificates');
  }

  setMatTabTooltip(link: string) {
    if (link === 'skills') {
      return this.translate.instant('profile.mat_tab_tooltip_skills');
    }
    if (link === 'projects') {
      return this.translate.instant('profile.mat_tab_tooltip_projects');
    }
    if (link === 'courses') {
      return this.translate.instant('profile.mat_tab_tooltip_courses');
    }
    return this.translate.instant('profile.mat_tab_tooltip_certificates');
  }
}
