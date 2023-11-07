import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {environment} from "../../../environments/environment";
import {HttpParams} from "@angular/common/http";
import {take} from "rxjs";
import {User} from "../../shared/interface/user";
import {MatSnackbarService} from "../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../shared/validator/http-validator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UiService} from "../../shared/services/default/ui.service";
import {SkillsListComponent} from "../skills/components/skill-list/skills-list.component";
import {ProjectsListComponent} from "../projects/components/projects-list/projects-list.component";
import {Project} from "../../shared/interface/project";
import {ProjectsItemComponent} from "../projects/components/projects-item/projects-item.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ContactFormComponent} from "../contact/contact-form/contact-form.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SocialService} from "../../shared/services/social.service";
import {SocialComponent} from "../social/social.component";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, SkillsListComponent, ProjectsListComponent, MatDialogModule, ContactFormComponent, TranslateModule, SocialComponent],
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
              private translateService: TranslateService,
              private socialService: SocialService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
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
          this.socialService.emitSocialEvent(user.social);
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000);
          if (error.status === 404) {
            this.router.navigate(['/not-found'])
          } else {
            this.router.navigate(['/error'])
          }
        }
      });
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
      width: '98%',
      maxWidth: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        project: project,
      }
    });
  }
}
