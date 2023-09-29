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
import {S3_FOLDER} from "../../../../shared/constants/api";
import {MatSnakebarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snakebar.service";

export interface SkillData {
  newSkill?: boolean;
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
  isUploadFailed = false;

  skillFile?: File;

  constructor(private fb: FormBuilder,
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: SkillData,
              private translateService: TranslateService,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service,
              private matSnackBarService: MatSnakebarService) {
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
      .subscribe((data: ImageCroppedData) => {
        if (data.returnImageType === 'blob' && data.objectUrl) {
          this.form.patchValue({tempImage: data.objectUrl});
          this.skillFile = data.file;
          return;
        }
        this.form.patchValue({tempImage: data.base64});
      })
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.form.valid) {
      this.credentialsService.getAwsCredentials()
        .pipe(take(1))
        .subscribe({
          next: (awsCredentials: AwsConfiguration) => {
            this.utilAwsS3Service.loadS3Client(awsCredentials.region, awsCredentials.accessKey, awsCredentials.secretKey);
            this.utilAwsS3Service.uploadSingleImageToAwsS3Bucket(awsCredentials.bucketName, this.skillFile!, S3_FOLDER)
              .then((imageUrl: string) => {
                this.form.patchValue({url: imageUrl});
                this.isUploadFailed = false;
              })
              .catch(() => {
                this.isUploadFailed = true;
                this.matSnackBarService.error('Upload image error', 'Close');
              });
          }
        });
    }
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
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl> this.form.get(formControlName), fieldName)
  }

  showMatErrorMessage(formControlName: string) {
    return FormValidator.validateExistError(<FormControl>this.form.get(formControlName), this.isFormSubmitted);
  }
}
