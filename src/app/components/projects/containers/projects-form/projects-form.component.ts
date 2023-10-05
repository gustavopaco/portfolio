import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../../../../shared/services/user.service";
import {take} from "rxjs";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {ACTION_CLOSE} from "../../../../shared/constants/constants";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {FormValidator} from "../../../../shared/validator/form-validator";
import {TranslateService} from "@ngx-translate/core";
import {
  ImageCropperDialogComponent
} from "../../../../shared/external/angular-material/image-cropper-dialog/image-cropper-dialog.component";
import {StatusProjectPipe} from "../../../../shared/pipe/status-project.pipe";

export interface ProjectData {
  newProject: boolean;
}

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, StatusProjectPipe],
  templateUrl: './projects-form.component.html',
  styleUrls: ['./projects-form.component.scss']
})
export class ProjectsFormComponent implements OnInit{

  form = this.fb.group({
    id: new FormControl<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    description: [''],
    url: [''],
    status: ['', [Validators.required]],
    tempImage: ['', [Validators.required]]
  });

  projectStatusList: string[] = [];

  isFormSubmitted = false;

  constructor(private matDialogRef: MatDialogRef<ProjectsFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProjectData,
              private fb: FormBuilder,
              private userService: UserService,
              private matSnackBarService: MatSnackbarService,
              private translateService: TranslateService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getProjectStatus();
  }

  private getProjectStatus() {
    this.userService.getProjectStatus()
      .pipe(take(1))
      .subscribe({
        next: (projectStatusList: string[]) => this.projectStatusList = projectStatusList,
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000)
      })
  }

  onSubmit() {
    this.isFormSubmitted = true;
    console.log(this.form.value);
  }

  onFileInputChange($event: Event) {
    this.openImageCropperDialog($event);
  }

  private openImageCropperDialog($event: Event) {
    this.matDialog.open(ImageCropperDialogComponent, {
      width: '100%',
      maxWidth: '800px',
      maxHeight: '600px',
      data: {
        imageChangedEvent: $event,
        returnImageType: 'blob',
        btnConfirmLabel: 'Load image',
        btnCancelLabel: 'Cancel'
      }
    });
  }

  matErrorMessage(formControlName: string, fieldName: string) {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl> this.form.get(formControlName), fieldName);
  }

  showMatErrorMessage(formControlName: string) {
    return FormValidator.validateExistError(<FormControl> this.form.get(formControlName), this.isFormSubmitted);
  }
}
