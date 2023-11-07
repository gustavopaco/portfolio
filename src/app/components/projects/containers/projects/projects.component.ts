import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsListComponent} from "../../components/projects-list/projects-list.component";
import {UserService} from "../../../../shared/services/user.service";
import {finalize, take} from "rxjs";
import {Project} from "../../../../shared/interface/project";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ProjectsFormComponent} from "../projects-form/projects-form.component";
import {ProjectsItemComponent} from "../../components/projects-item/projects-item.component";
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {
  LoadingDialogComponent
} from "../../../../shared/external/angular-material/loading-dialog/loading-dialog.component";
import {HttpParams} from "@angular/common/http";
import {AuthService} from "../../../../shared/services/default/auth.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectsListComponent, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  isLoadingProjects: boolean = true;
  isFailedToLoadProjects: boolean = false;

  projects: Project[] = [];

  constructor(private userService: UserService,
              private authService: AuthService,
              private translateService: TranslateService,
              private matSnackBarService: MatSnackbarService,
              private matDialog: MatDialog,
              private utilAwsS3Service: UtilAwsS3Service,
              private credentialsService: CredentialsService) {
  }

  ngOnInit(): void {
    this.getProjectRecords();
  }

  private getProjectRecords() {
    this.onRequestLoadingProjects();
    this.userService.getProjectRecords(this.paramsToRequest())
      .pipe(take(1), finalize(() => this.isLoadingProjects = false))
      .subscribe({
        next: (projects: Project[]) => this.projects = projects,
        error: (error: any) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000);
          this.isFailedToLoadProjects = true;
        }
      })
  }

  private paramsToRequest(): HttpParams {
    return new HttpParams().set('nickname', this.authService.getNickname());
  }

  private getProjectRecord(id: number) {
    this.userService.getProjectRecord(id)
      .pipe(take(1))
      .subscribe({
        next: (project: Project) => this.openProjectItemDialog(project),
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000)
      })
  }

  onAddProject() {
    this.openProjectFormDialog(true);
  }

  openProjectFormDialog(newProject: boolean, project?: Project) {
    const matDialogRef = this.matDialog.open(ProjectsFormComponent, {
      width: '100%',
      maxWidth: '800px',
      data: {
        newProject: newProject,
        projectToEdit: project
      },
      autoFocus: false
    });

    matDialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.getProjectRecords();
        }
      })
  }

  openProjectItemDialog(project: Project) {
    const dialogRef = this.matDialog.open(ProjectsItemComponent, {
      width: '100%',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        project: project,
        editable: true
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result?.action === 'edit') {
          this.openProjectFormDialog(false, result.project);
        } else if (result?.action === 'delete') {
          const project = result.project as Project;
          this.deleteProject(project);
        }
      })
  }

  private deleteProject(project: Project) {
    const loadingDialogRef = this.openLoadingDialog(this.translateService.instant('projects.loading_delete_project'), this.translateService.instant('projects.loading_delete_project_description'));
    if (this.existPreviousImage(project)) {
      this.loadCredentials(loadingDialogRef, project);
    } else {
      this.deleteProjectRecord(loadingDialogRef, project.id);
    }
  }

  private loadCredentials(loadingDialogRef: MatDialogRef<LoadingDialogComponent>, project: Project) {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (credentials: AwsConfiguration) => this.deleteProjectImageFromAwsS3Bucket(loadingDialogRef, credentials, project),
        error: (error: any) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000);
          loadingDialogRef.close();
        }
      })
  }

  private deleteProjectImageFromAwsS3Bucket(loadingDialogRef: MatDialogRef<LoadingDialogComponent>, credentials: AwsConfiguration, project: Project) {
    this.utilAwsS3Service.loadS3Client(credentials.region, credentials.accessKey, credentials.secretKey);
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(credentials.bucketName, project.pictureUrl)
      .then(() => this.deleteProjectRecord(loadingDialogRef, project.id))
      .catch(() => {
        this.matSnackBarService.error(this.translateService.instant('generic_messages.failed_to_delete_stored_image'), this.translateService.instant('generic_messages.action_close'), 5000);
        loadingDialogRef.close();
      })
  }

  private deleteProjectRecord(loadingDialogRef: MatDialogRef<LoadingDialogComponent>, id: number) {
    this.userService.deleteProjectRecord(id)
      .pipe(take(1), finalize(() => loadingDialogRef.close()))
      .subscribe({
        next: () => {
          this.matSnackBarService.success(this.translateService.instant('projects.project_deleted_successfully'), this.translateService.instant('generic_messages.action_close'));
          this.getProjectRecords();
        },
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000)
      })
  }

  private onRequestLoadingProjects() {
    this.isLoadingProjects = true;
    this.isFailedToLoadProjects = false;
  }

  onProjectClicked(id: number) {
    this.getProjectRecord(id);
  }

  private existPreviousImage(project: Project) {
    return project.pictureUrl && project.pictureUrl !== '';
  }

  openLoadingDialog(title: string, message: string) {
    return this.matDialog.open(LoadingDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '600px',
      autoFocus: false,
      disableClose: true,
      data: {
        title: title,
        message: message,
      }
    });
  }
}
