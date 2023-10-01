import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ImageCropperModule} from "ngx-image-cropper";
import {MatIconModule} from "@angular/material/icon";
import {
  ImageCroppedData,
  ImageCropperDialogComponent
} from "../../../../shared/external/angular-material/image-cropper-dialog/image-cropper-dialog.component";
import {finalize, take} from "rxjs";
import {StarRatingComponent} from "../../../../shared/external/angular-material/star-rating/star-rating.component";
import {FormularioDebugComponent} from "../../../../shared/components/formulario-debug/formulario-debug.component";
import {FormValidator} from "../../../../shared/validator/form-validator";
import {TranslateService} from "@ngx-translate/core";
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {MatSnakebarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snakebar.service";
import {S3_SKILLS_FOLDER} from "../../../../shared/constants/api";
import {UserService} from "../../../../shared/services/user.service";
import {
  ACTION_CLOSE,
  FAILED_TO_SAVE_SKILL,
  FAILED_TO_UPLOAD_IMAGE,
  SKILL_SAVED_SUCCESSFULLY
} from "../../../../shared/constants/constants";

export interface SkillData {
  newSkill?: boolean;
  isFailedToUploadImage: boolean;
}

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ImageCropperModule, MatIconModule, MatDialogModule, StarRatingComponent, FormularioDebugComponent],
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
export class SkillsFormComponent {
  form = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    description: ['', [Validators.maxLength(100)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    url: [''],
    tempImage: ['', [Validators.required]]
  });

  isFormSubmitted = false;
  disabledForm = false;


  skillFile?: File;

  constructor(private fb: FormBuilder,
              private matDialog: MatDialog,
              private matDialogRef: MatDialogRef<SkillsFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SkillData,
              private translateService: TranslateService,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service,
              private matSnackBarService: MatSnakebarService,
              private userService: UserService) {
  }

  onFileInputChange($event: Event) {
    this.openImageCropperDialog($event);
  }

  private openImageCropperDialog($event: Event) {
    const dialogRef = this.matDialog.open(ImageCropperDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '600px',
      maxHeight: '600px',
      data: {
        imageChangedEvent: $event,
        btnConfirmLabel: 'Load image',
        btnCancelLabel: 'Cancel',
        returnImageType: 'blob',
        resizeToWidth: 60,
        resizeToHeight: 60,
      }
    });
    this.onClosedImageCropperDialog(dialogRef, $event);
  }

  private onClosedImageCropperDialog(dialogRef: MatDialogRef<ImageCropperDialogComponent>, $event: Event) {
    dialogRef.afterClosed()
      .pipe(
        take(1),
        finalize(() => ($event.target as HTMLInputElement).value = '')
      )
      .subscribe((data: ImageCroppedData | undefined) => {
        if (data?.returnImageType === 'blob' && data.objectUrl) {
          this.form.patchValue({tempImage: data.objectUrl});
          this.skillFile = data.file;
          return;
        }
        if (data?.returnImageType === 'base64' && data.base64) {
          this.form.patchValue({tempImage: data.base64});
        }
      })
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.form.valid) {
      if (this.form.get('tempImage')?.value) {
        this.loadCredentials();
        return;
      }
      this.saveSkill();
    }
  }

  private loadCredentials() {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (awsCredentials: AwsConfiguration) => {
          this.uploadToAwsS3Bucket(awsCredentials);
        }
      });
  }

  private uploadToAwsS3Bucket(awsCredentials: AwsConfiguration) {
    this.utilAwsS3Service.loadS3Client(awsCredentials.region, awsCredentials.accessKey, awsCredentials.secretKey);
    this.utilAwsS3Service.uploadSingleImageToAwsS3Bucket(awsCredentials.bucketName, this.skillFile!, S3_SKILLS_FOLDER)
      .then((imageUrl: string) => {
        this.form.patchValue({url: imageUrl});
        this.saveSkill();
      })
      .catch(() => {
        this.onFailedToUploadImage();
        this.matSnackBarService.error(FAILED_TO_UPLOAD_IMAGE, ACTION_CLOSE);
      });
  }

  private saveSkill() {
    this.userService.saveSKillRecord(this.form.value)
      .pipe(
        take(1),
        finalize(() => this.disabledForm = false)
      )
      .subscribe({
        next: () => {
          this.matSnackBarService.success(SKILL_SAVED_SUCCESSFULLY, ACTION_CLOSE);
          this.matDialogRef.close(true);
        },
        error: () => this.matSnackBarService.error(FAILED_TO_SAVE_SKILL, ACTION_CLOSE)
      })
  }

  onFailedToUploadImage() {
    this.data.isFailedToUploadImage = true;
  }

  onRatingChange(value: number) {
    this.form.patchValue({rating: value});
  }

  get tempImage() {
    return this.form.get('tempImage')?.value;
  }

  overlayClass() {
    return this.tempImage ? 'overlay-close' : 'overlay-open';
  }

  matErrorMessage(formControlName: string, fieldName: string) {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl>this.form.get(formControlName), fieldName)
  }

  matErrorImageMessage(formControlName: string, fieldName: string) {
    if (this.showMatErrorMessage(formControlName)) return this.matErrorMessage(formControlName, fieldName);
    if (this.data.isFailedToUploadImage) return this.translateService.instant('upload');
    return '';
  }

  showMatErrorMessage(formControlName: string) {
    return FormValidator.validateExistError(<FormControl>this.form.get(formControlName), this.isFormSubmitted);
  }
}
