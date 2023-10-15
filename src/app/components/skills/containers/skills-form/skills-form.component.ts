import {Component, Inject, OnInit} from '@angular/core';
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
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {S3_SKILLS_FOLDER} from "../../../../shared/constants/api";
import {UserService} from "../../../../shared/services/user.service";
import {
  ACTION_CLOSE, FAILED_TO_DELETE_STORED_IMAGE,
  FAILED_TO_SAVE_SKILL,
  FAILED_TO_UPLOAD_IMAGE, NO_CHANGES_WERE_MADE,
  SKILL_SAVED_SUCCESSFULLY
} from "../../../../shared/constants/constants";
import {Skill} from "../../../../shared/interface/skill";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

export interface SkillData {
  newSkill?: boolean;
  isFailedToUploadImage: boolean;
  skillToEdit?: Skill;
}

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ImageCropperModule, MatIconModule, MatDialogModule, StarRatingComponent, FormularioDebugComponent, MatProgressSpinnerModule],
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
export class SkillsFormComponent implements OnInit {
  form = this.fb.group({
    id: new FormControl<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    description: ['', [Validators.maxLength(100)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    pictureUrl: [''],
    tempImage: ['', [Validators.required]]
  });

  isFormSubmitted = false;
  isDisabledForm = false;

  skillFile?: File;

  constructor(private fb: FormBuilder,
              private matDialog: MatDialog,
              private matDialogRef: MatDialogRef<SkillsFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SkillData,
              private translateService: TranslateService,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service,
              private matSnackBarService: MatSnackbarService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadSkillToEdit();
  }

  private loadSkillToEdit() {
    if (!this.data.newSkill && this.data.skillToEdit) {
      this.form.patchValue(this.data.skillToEdit);
    }
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
    this.removeValidatorsOnEditSkillFormSubmittedWithoutNewImage();
    if (this.form.valid && !this.isDisabledForm) {
      this.disableForm();
      if (this.form.get('tempImage')?.value) {
        this.loadCredentials();
        return;
      }
      if (this.existChangesOnSkillFromFormData()) {
        this.saveSkill();
        return;
      }
      this.matSnackBarService.warning(NO_CHANGES_WERE_MADE, ACTION_CLOSE,3000, 'center', 'top');
      this.matDialogRef.close(false);
    }
  }

  private removeValidatorsOnEditSkillFormSubmittedWithoutNewImage() {
    if (!this.data.newSkill && this.data.skillToEdit && this.tempImage === '' && this.pictureUrl !== '') {
      this.form.get('tempImage')?.removeValidators([Validators.required]);
      this.form.get('tempImage')?.updateValueAndValidity();
    }
  }

  private existChangesOnSkillFromFormData() {
    const skill = this.data.skillToEdit;
    return skill?.name !== this.form.get('name')?.value ||
      skill?.description !== this.form.get('description')?.value ||
      skill?.rating !== this.form.get('rating')?.value ||
      skill?.pictureUrl !== this.form.get('pictureUrl')?.value;
  }

  private loadCredentials() {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (awsCredentials: AwsConfiguration) => {
          this.utilAwsS3Service.loadS3Client(awsCredentials.region, awsCredentials.accessKey, awsCredentials.secretKey);
          if (this.existPreviousImage()) {
            this.deletePreviousImage(awsCredentials, this.pictureUrl!)
          }
          this.uploadToAwsS3Bucket(awsCredentials);
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000);
          this.enableForm();
        }
      });
  }

  private deletePreviousImage(credentials: AwsConfiguration, previousImage: string) {
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(credentials.bucketName, previousImage)
      .then(() => {
        this.form.patchValue({pictureUrl: ''})
        this.uploadToAwsS3Bucket(credentials);
      })
      .catch(() => {
        this.matSnackBarService.error(FAILED_TO_DELETE_STORED_IMAGE, ACTION_CLOSE, 5000);
        this.enableForm();
      });
  }

  private uploadToAwsS3Bucket(awsCredentials: AwsConfiguration) {
    this.utilAwsS3Service.uploadSingleImageToAwsS3Bucket(awsCredentials.bucketName, this.skillFile!, S3_SKILLS_FOLDER)
      .then((imageUrl: string) => {
        this.form.patchValue({pictureUrl: imageUrl});
        this.saveSkill();
      })
      .catch(() => {
        this.onFailedToUploadImage();
        this.matSnackBarService.error(FAILED_TO_UPLOAD_IMAGE, ACTION_CLOSE);
        this.enableForm();
      });
  }

  private saveSkill() {
    this.userService.saveSkillRecord(this.form.value)
      .pipe(
        take(1),
        finalize(() => this.enableForm())
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

  get pictureUrl() {
    return this.form.get('pictureUrl')?.value;
  }

  private existPreviousImage() {
    return this.pictureUrl;
  }

  overlayClass() {
    return this.tempImage || this.pictureUrl ? 'overlay-close' : 'overlay-open';
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

  private disableForm() {
    this.isDisabledForm = true;
  }

  private enableForm() {
    this.isDisabledForm = false;
  }
}
