import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../../../../shared/services/user.service";
import {finalize, take} from "rxjs";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {ACTION_CLOSE} from "../../../../shared/constants/constants";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {FormValidator} from "../../../../shared/validator/form-validator";
import {TranslateService} from "@ngx-translate/core";
import {
  ImageCroppedData,
  ImageCropperDialogComponent
} from "../../../../shared/external/angular-material/image-cropper-dialog/image-cropper-dialog.component";
import {StatusProjectPipe} from "../../../../shared/pipe/status-project.pipe";
import {UtilImageOrientation} from "../../../../shared/utils/util-image-orientation";
import {FormularioDebugComponent} from "../../../../shared/components/formulario-debug/formulario-debug.component";
import {getRibbonClass} from "../../../../shared/utils/project-status-to-ribbon-class";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";

export interface ProjectData {
  newProject: boolean;
}

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, StatusProjectPipe, FormularioDebugComponent, MatRippleModule, MatTooltipModule],
  templateUrl: './projects-form.component.html',
  styleUrls: ['./projects-form.component.scss']
})
export class ProjectsFormComponent implements OnInit {

  form = this.fb.group({
    id: new FormControl<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    description: [''],
    url: [''],
    pictureUrl: [''],
    pictureOrientation: [''],
    status: ['', [Validators.required]],
    tempImage: ['', [Validators.required]]
  });

  projectStatusList: string[] = [];
  filePicture?: File;

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

  onFileInputChange(event: Event) {
    this.openImageCropperDialog(event);
  }

  private openImageCropperDialog(event: Event) {
    const dialogRef = this.matDialog.open(ImageCropperDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '700px',
      maxHeight: '700px',
      data: {
        imageChangedEvent: event,
        returnImageType: 'blob',
        title: 'Project image',
        resizeToWidth: 533.33,
        resizeToHeight: 300,
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1), finalize(() => this.clearEventValue(event)))
      .subscribe((result: ImageCroppedData) => {
        if (result.returnImageType === 'blob' && result.objectUrl && result.file) {
          this.form.patchValue({tempImage: result.objectUrl});
            this.detectImageOrientation(result.file);
            this.filePicture = result.file;
        } else if (result.returnImageType === 'base64' && result.base64) {
          this.form.patchValue({tempImage: result.base64});
        }
      });
  }

  private detectImageOrientation(file: File) {
    UtilImageOrientation.detectOrientation(file)
      .then((result) => {
        this.form.patchValue({pictureOrientation: result})
      })
      .catch((error) => {
        this.matSnackBarService.error(error.message, ACTION_CLOSE, 5000);
      });
  }

  private clearEventValue(event: Event) {
    (<HTMLInputElement>event.target).value = '';
  }

  get tempImage() {
    return this.form.get('tempImage')?.value;
  }

  get status() {
    return this.form.get('status')?.value;
  }

  matErrorMessage(formControlName: string, fieldName: string) {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl>this.form.get(formControlName), fieldName);
  }

  showMatErrorMessage(formControlName: string) {
    return FormValidator.validateExistError(<FormControl>this.form.get(formControlName), this.isFormSubmitted);
  }

  setRibbonColor() {
    return getRibbonClass(this.form.get('status')?.value ?? '');
  }
}
