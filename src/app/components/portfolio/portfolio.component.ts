import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {environment} from "../../../environments/environment";
import {HttpParams} from "@angular/common/http";
import {take} from "rxjs";
import {User} from "../../shared/interface/user";
import {MatSnackbarService} from "../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {ACTION_CLOSE} from "../../shared/constants/constants";
import {HttpValidator} from "../../shared/validator/http-validator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UiService} from "../../shared/services/default/ui.service";
import {SkillsListComponent} from "../skills/components/skill-list/skills-list.component";
import {ProjectsListComponent} from "../projects/components/projects-list/projects-list.component";
import {Project} from "../../shared/interface/project";
import {ProjectsItemComponent} from "../projects/components/projects-item/projects-item.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ContactFormComponent} from "../contact/contact-form/contact-form.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, SkillsListComponent, ProjectsListComponent, MatDialogModule, ContactFormComponent, TranslateModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  user?: User;
  socialsClassIcons = [
    ' fa-github ', ' fa-linkedin ', ' fa-facebook ', ' fa-instagram ', ' fa-x-twitter ', ' fa-youtube '
  ]

  mouseOverSocialIconIndex: number | null = null;
  countSocials = 0;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private matSnackBarService: MatSnackbarService,
              private uiService: UiService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getPathParams();
  }

  private getPathParams() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        params['nickname'] ? this.loadUserData(params['nickname']) : this.loadUserData(environment.OWNER_NICKNAME);
      })
  }

  private paramsToRequest(nickname: string) {
    return new HttpParams().set('nickname', nickname);
  }

  private loadUserData(nickname: string) {
    this.userService.getUserDataRecord(this.paramsToRequest(nickname))
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.getSocialsCount();
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000);
          // todo: redirect to 404 page
        }
      });
  }

  private getSocialsCount() {
    this.countSocials = 0;
    if (this.user?.social.facebook) this.countSocials++;
    if (this.user?.social.github) this.countSocials++;
    if (this.user?.social.instagram) this.countSocials++;
    if (this.user?.social.linkedin) this.countSocials++;
    if (this.user?.social.twitter) this.countSocials++;
    if (this.user?.social.youtube) this.countSocials++;
  }

  showHideSocials(iconBrand: string) {
    if ((this.user?.social.facebook && iconBrand.includes('facebook'))
      || (this.user?.social.github && iconBrand.includes('github'))
      || (this.user?.social.instagram && iconBrand.includes('instagram'))
      || (this.user?.social.linkedin && iconBrand.includes('linkedin'))
      || (this.user?.social.twitter && iconBrand.includes('twitter'))
      || (this.user?.social.youtube && iconBrand.includes('facebook'))) {
      return true;
    }
    return false;
  }

  setSocialsClass(iconBrand: string, x: number) {
    let socialClass = iconBrand;
    if (this.mouseOverSocialIconIndex === x) {
      socialClass += ' fa-beat ';
    }
    if (this.countSocials > 1) {
      socialClass += ' me-3 ';
    }
    return socialClass;
  }

  setMatTooltip(iconBrand: string) {
    if (iconBrand.includes('facebook')) return 'Facebook';
    if (iconBrand.includes('github')) return 'Github';
    if (iconBrand.includes('instagram')) return 'Instagram';
    if (iconBrand.includes('linkedin')) return 'Linkedin';
    if (iconBrand.includes('twitter')) return 'Twitter';
    if (iconBrand.includes('youtube')) return 'Youtube';
    return '';
  }

  scrollToElement(element: string) {
    this.uiService.scrollToElement(element)
  }

  onProjectClicked(idProject: number) {
        this.openProjectItemDialog(this.getProjectRecordById(idProject)!);
  }

  private getProjectRecordById(idProject: number) {
    return this.user?.projects?.find(project => project.id === idProject);
  }

  openProjectItemDialog(project: Project) {
    this.matDialog.open(ProjectsItemComponent, {
      width: '100%',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        project: project,
      }
    });
  }
}
