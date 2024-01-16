import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {environment} from "../../../environments/environment";
import {HttpParams} from "@angular/common/http";
import {finalize, take} from "rxjs";
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
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CoursesListComponent} from "../courses/components/courses-list/courses-list.component";
import {PdfDialogComponent} from "../../shared/external/angular-material/pdf-dialog/pdf-dialog.component";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, SkillsListComponent, ProjectsListComponent, MatDialogModule, ContactFormComponent, TranslateModule, SocialComponent, MatButtonModule, MatProgressSpinnerModule, CoursesListComponent, MatIconModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  user?: User;

  isLoadingUserData = true;
  isUserBioDataValid = false;
  isPdfDialogOpened = false;

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
      .pipe(
        take(1),
        finalize(() => this.isLoadingUserData = false)
      )
      .subscribe({
        next: (user) => {
          this.user = user;
          this.validateUserBioData();
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
    this.getProjectRecordById(idProject);
  }

  private getProjectRecordById(idProject: number) {
    this.userService.getProjectRecord(idProject)
      .pipe(take(1))
      .subscribe({
        next: (project) => {
          this.openProjectItemDialog(project);
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000);
        }
      })
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

  validateUserBioData() {
    if (this.user?.bio === null || this.user?.bio === undefined) {
      this.isUserBioDataValid = false;
      return;
    }
    if (!((this.user?.bio?.avatarUrl === null || this.user?.bio?.avatarUrl === undefined)
      && (this.user?.bio?.fullName === null || this.user?.bio?.fullName === undefined)
      && (this.user?.bio?.jobTitle === null || this.user?.bio?.jobTitle === undefined)
      && (this.user?.bio?.presentation === null || this.user?.bio?.presentation === undefined)
      && (this.user?.bio?.testimonial === null || this.user?.bio?.testimonial === undefined))) {
      this.isUserBioDataValid = true;
    }
  }

  openPdfDialog() {
    if (!this.isPdfDialogOpened) {
      this.isPdfDialogOpened = true;
      const pdfDialogData = this.user?.certificates.map(certificate => {
        return {
          url: certificate.url,
          title: this.translateService.instant('portfolio.certificates')
        }
      });
      const pdfDialogRef = this.matDialog.open(PdfDialogComponent, {
        width: '80%',
        height: '800px',
        data: pdfDialogData
      });
      pdfDialogRef.afterClosed()
        .pipe(take(1))
        .subscribe(() => {
          this.isPdfDialogOpened = false;
        });
    }
  }
}
