import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsListComponent} from "../../components/projects-list/projects-list.component";
import {UserService} from "../../../../shared/services/user.service";
import {finalize, take} from "rxjs";
import {Project} from "../../../../shared/interface/project";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {ACTION_CLOSE} from "../../../../shared/constants/constants";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ProjectsFormComponent} from "../projects-form/projects-form.component";
import {ProjectsItemComponent} from "../../components/projects-item/projects-item.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectsListComponent, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  isLoadingProjects: boolean = true;
  isFailedToLoadProjects: boolean = false;

  projects: Project[] = [];

  constructor(private userService: UserService,
              private matSnackBarService: MatSnackbarService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getProjectRecords();
  }

  private getProjectRecords() {
    this.onRequestLoadingProjects();
    this.userService.getProjectRecords()
      .pipe(take(1), finalize(() => this.isLoadingProjects = false))
      .subscribe({
        next: (projects: Project[]) => this.projects = projects,
        error: (error: any) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000);
          this.isFailedToLoadProjects = true;
        }
      })
  }

  private getProjectRecord(id: number) {
    this.userService.getProjectRecord(id)
      .pipe(take(1))
      .subscribe({
        next: (project: Project) => this.openProjectItemDialog(project),
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000)
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
        }
      })
  }

  private onRequestLoadingProjects() {
    this.isLoadingProjects = true;
    this.isFailedToLoadProjects = false;
  }

  onProjectClicked(id: number) {
    this.getProjectRecord(id);
  }
}
