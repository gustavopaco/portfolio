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
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {FormValidator} from "../../../../shared/validator/form-validator";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
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
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {S3_PROJECTS_FOLDER} from "../../../../shared/constants/api";
import {Project} from "../../../../shared/interface/project";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";

export interface ProjectData {
  newProject: boolean;
  isFailedToUploadImage: boolean;
  projectToEdit?: Project;
}

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, StatusProjectPipe, FormularioDebugComponent, MatRippleModule, MatTooltipModule, MatProgressSpinnerModule, MatToolbarModule, TranslateModule],
  templateUrl: './projects-form.component.html',
  styleUrls: ['./projects-form.component.scss']
})
export class ProjectsFormComponent implements OnInit {

  form = this.fb.group({
    id: new FormControl<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    description: ['', [Validators.required]],
    url: new FormControl<string | null>(null),
    pictureUrl: new FormControl<string | null>(null),
    pictureOrientation: new FormControl<string | null>(null),
    status: ['', [Validators.required]],
    tempImage: new FormControl<string | null>(null)
  });

  projectStatusList: string[] = [];
  filePicture?: File;

  isFormSubmitted = false;
  isDisabledForm = false;

  constructor(private matDialogRef: MatDialogRef<ProjectsFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProjectData,
              private fb: FormBuilder,
              private userService: UserService,
              private matSnackBarService: MatSnackbarService,
              private translateService: TranslateService,
              private matDialog: MatDialog,
              private utilAwsS3Service: UtilAwsS3Service,
              private credentialsService: CredentialsService) {
  }

  ngOnInit(): void {
    this.getProjectStatus();
    this.loadProjectToEdit();
  }

  private getProjectStatus() {
    this.userService.getProjectStatus()
      .pipe(take(1))
      .subscribe({
        next: (projectStatusList: string[]) => this.projectStatusList = projectStatusList,
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000)
      })
  }

  private loadProjectToEdit() {
    if (!this.data.newProject && this.data.projectToEdit) {
      this.form.patchValue(this.data.projectToEdit);
    }
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
        this.matSnackBarService.error(error.message, this.translateService.instant('generic_messages.action_close'), 5000);
      });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.form.valid && !this.isDisabledForm) {
      this.disableForm();
      if (this.tempImage) {
        this.loadCredentials();
        return;
      }
      if (this.verifyIsNewProjectOrExistChangesOnProjectFromFormData()) {
        this.saveProject();
        return;
      }
      this.matSnackBarService.warning(this.translateService.instant('projects_form.messages.no_changes'), this.translateService.instant('generic_messages.action_close'), 3000, 'center', 'top');
      this.matDialogRef.close(false);
    }
  }

  private loadCredentials() {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (credentials: AwsConfiguration) => {
          this.utilAwsS3Service.loadS3Client(credentials.region, credentials.accessKey, credentials.secretKey);
          if (this.existPreviousImage()) {
            this.deletePreviousImage(credentials, this.data.projectToEdit!.pictureUrl)
          } else {
            this.uploadToS3Bucket(credentials);
          }
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000);
          this.enableForm();
        }
      });
  }

  private existPreviousImage() {
    return this.pictureUrl;
  }

  private deletePreviousImage(credentials: AwsConfiguration, previousImage: string) {
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(credentials.bucketName, previousImage)
      .then(() => {
        this.form.patchValue({pictureUrl: null, pictureOrientation: null});
        this.uploadToS3Bucket(credentials);
      })
      .catch(() => {
        this.matSnackBarService.error(this.translateService.instant('generic_messages.failed_to_delete_stored_image'), this.translateService.instant('generic_messages.action_close'), 5000);
        this.enableForm();
      });
  }

  private uploadToS3Bucket(credentials: AwsConfiguration) {
    this.utilAwsS3Service.uploadSingleImageToAwsS3Bucket(credentials.bucketName, this.filePicture!, S3_PROJECTS_FOLDER)
      .then((result) => {
        this.form.patchValue({pictureUrl: result});
        this.saveProject();
      })
      .catch(() => {
        this.onFailedToUploadImage();
        this.matSnackBarService.error(this.translateService.instant('generic_messages.failed_to_upload_image'), this.translateService.instant('generic_messages.action_close'), 5000)
        this.enableForm();
      });
  }

  private onFailedToUploadImage() {
    this.data.isFailedToUploadImage = true;
  }

  private verifyIsNewProjectOrExistChangesOnProjectFromFormData() {
    if (this.data.newProject) return true;
    const project = this.data.projectToEdit;
    return project?.name !== this.form.get('name')?.value ||
      project?.description !== this.form.get('description')?.value ||
      project?.url !== this.form.get('url')?.value ||
      project?.pictureUrl !== this.form.get('pictureUrl')?.value ||
      project?.status !== this.form.get('status')?.value;
  }

  private saveProject() {
    this.userService.saveProjectRecord(this.form.value)
      .pipe(
        take(1),
        finalize(() => this.enableForm())
      )
      .subscribe({
        next: () => {
          this.matSnackBarService.success(this.translateService.instant('projects_form.messages.success'), this.translateService.instant('generic_messages.action_close'), 5000);
          this.matDialogRef.close(true);
        },
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'), 5000)
      })
  }

  private clearEventValue(event: Event) {
    (<HTMLInputElement>event.target).value = '';
  }

  get tempImage() {
    return this.form.get('tempImage')?.value;
  }

  get pictureUrl() {
    return this.form.get('pictureUrl')?.value;
  }

  get status() {
    return this.form.get('status')?.value;
  }

  matErrorMessage(formControlName: string, fieldName: string) {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl>this.form.get(formControlName), fieldName);
  }

  matErrorImageMessage() {
    if (this.data.isFailedToUploadImage) return this.translateService.instant('upload');
    return '';
  }

  showMatErrorMessage(formControlName: string) {
    return FormValidator.validateExistError(<FormControl>this.form.get(formControlName), this.isFormSubmitted);
  }

  setRibbonColor() {
    return getRibbonClass(this.form.get('status')?.value ?? '');
  }

  private disableForm() {
    this.isDisabledForm = true;
  }

  private enableForm() {
    this.isDisabledForm = false;
  }
}
