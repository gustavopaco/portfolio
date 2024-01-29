import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Bio} from "../../../../shared/interface/bio";
import {UserService} from "../../../../shared/services/user.service";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {finalize, map, Observable, take, tap} from "rxjs";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {S3_AVATAR_FOLDER} from "../../../../shared/constants/api";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {
  ImageCroppedData,
  ImageCropperDialogComponent
} from "../../../../shared/external/angular-material/image-cropper-dialog/image-cropper-dialog.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatStepperModule, StepperOrientation} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Social} from "../../../../shared/interface/social";
import {AuthService} from "../../../../shared/services/default/auth.service";
import {HttpParams} from "@angular/common/http";
import {User} from "../../../../shared/interface/user";
import {FormularioDebugComponent} from "../../../../shared/components/formulario-debug/formulario-debug.component";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SocialService} from "../../../../shared/services/social.service";

@Component({
  selector: 'app-bio-form',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatToolbarModule, MatFormFieldModule, MatIconModule, MatDialogModule, MatButtonModule, MatInputModule, MatStepperModule, ReactiveFormsModule, FormularioDebugComponent, TranslateModule],
  templateUrl: './bio-form.component.html',
  styleUrls: ['./bio-form.component.scss'],
  providers: [
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
  ]
})
export class BioFormComponent {

  form = this.fb.group({
    bio: this.fb.group({
      id: new FormControl<number | null>(null),
      avatarUrl: new FormControl<string | null>(null),
      tempAvatarUrl: new FormControl<string | null>(null),
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      jobTitle: ['', [Validators.required, Validators.maxLength(50)]],
      presentation: ['', [Validators.required, Validators.maxLength(250)]],
      testimonial: ['', [Validators.required, Validators.maxLength(1000)]]
    }),
    social: this.fb.group({
      id: new FormControl<number | null>(null),
      facebook: ['', [Validators.maxLength(100)]],
      instagram: ['', [Validators.maxLength(100)]],
      linkedin: ['', [Validators.maxLength(100)]],
      github: ['', [Validators.maxLength(100)]],
      twitter: ['', [Validators.maxLength(100)]],
      youtube: ['', [Validators.maxLength(100)]],
    })
  });

  userData$: Observable<User>;

  bio?: Bio;
  social?: Social;

  isLoadingRequestMatStepperForm = false;
  isLinear = false;

  stepperOrientation: Observable<StepperOrientation>

  constructor(private userService: UserService,
              private authService: AuthService,
              private socialService: SocialService,
              private translateService: TranslateService,
              private fb: FormBuilder,
              private breakpointObserver: BreakpointObserver,
              private matDialog: MatDialog,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service,
              private matSnackBarService: MatSnackbarService) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(
        takeUntilDestroyed(),
        map(({matches}) => matches ? 'horizontal' : 'vertical')
      );
    this.userData$ = this.getBioSocialRecord();

  }

  private paramsToRequest(): HttpParams {
    return new HttpParams().set('nickname', this.authService.getNickname());
  }

  private getBioSocialRecord(loadingImageOnly: boolean = false) {
    return this.userService.getUserDataBioSocialRecord(this.paramsToRequest())
      .pipe(
        take(1),
        tap((user: User) => {
          this.bio = user.bio;
          this.social = user.social;
          this.socialService.emitSocialEvent(user.social);
          this.loadBioSocialOnForm(user, loadingImageOnly);
        }),
      );
  }

  private loadBioSocialOnForm(user: User, loadingImageOnly: boolean) {
    this.bioGroup?.patchValue({
      id: user.bio?.id,
      avatarUrl: user.bio?.avatarUrl,
      fullName: user.bio?.fullName,
      jobTitle: user.bio?.jobTitle,
      presentation: user.bio?.presentation,
      testimonial: user.bio?.testimonial,
      tempAvatarUrl: null
    });
    if (!loadingImageOnly) {
      this.socialGroup?.patchValue({
        id: user.social?.id,
        facebook: user.social?.facebook,
        instagram: user.social?.instagram,
        linkedin: user.social?.linkedin,
        github: user.social?.github,
        twitter: user.social?.twitter,
        youtube: user.social?.youtube
      });
    }
  }

  onFileInputChange($event: Event) {
    this.openImageCropperDialog($event);
  }

  private openImageCropperDialog($event: Event) {
    const dialogRef: MatDialogRef<ImageCropperDialogComponent> = this.matDialog.open(ImageCropperDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '700px',
      maxHeight: '700px',
      data: {
        imageChangedEvent: $event,
        returnImageType: 'blob',
        title: this.translateService.instant('image_cropper.titles.crop_your_avatar'),
        resizeToWidth: 250,
        resizeToHeight: 250,
        roundCropper: true
      }
    });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        finalize(() => ($event.target as HTMLInputElement).value = '')
      )
      .subscribe((data: ImageCroppedData | undefined) => {
        if (data?.returnImageType === 'blob' && data?.objectUrl && data?.file) {
          this.tempAvatarUrl?.setValue(data.objectUrl);
          this.saveAvatar(data.file);
        }
      })
  }

  saveAvatar(file: File) {
    this.loadCredentials(file);
  }

  onSubmit() {
    if ((this.existChangesOnBioFormGroup() || this.existChangesOnSocialFormGroup()) && !this.isLoadingRequestMatStepperForm) {
      this.saveBioSocialRecord();
    }
  }

  private loadCredentials(file: File) {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (credentials: AwsConfiguration) => {
          this.utilAwsS3Service.loadS3Client(credentials.region, credentials.accessKey, credentials.secretKey);
          if (this.existPreviousImage()) {
            this.deletePreviousImage(credentials, file);
          } else {
            this.uploadToAwsS3Bucket(credentials, file);
          }
        },
        error: (error: any) => this.matSnackBarService.error(error, this.translateService.instant('generic.actions.close'), 5000)
      })
  }

  private deletePreviousImage(credentials: AwsConfiguration, file: File) {
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(credentials.bucketName, this.avatarUrl?.value!)
      .then(() => this.uploadToAwsS3Bucket(credentials, file))
      .catch(() => this.matSnackBarService.error(this.translateService.instant('generic.messages.failed_to_delete_stored_image'), this.translateService.instant('generic.actions.close'), 5000))
  }

  private uploadToAwsS3Bucket(credentials: AwsConfiguration, file: File) {
    this.utilAwsS3Service.uploadSingleImageToAwsS3Bucket(credentials.bucketName, file, S3_AVATAR_FOLDER)
      .then((imageUrl: string) => {
        this.defineNewImage(imageUrl);
        this.saveBioImageRecord();
      })
      .catch((error: any) => this.matSnackBarService.error(error, this.translateService.instant('generic.actions.close'), 5000))
  }

  private defineNewImage(imageUrl: string) {
    this.avatarUrl?.setValue(imageUrl);
    this.tempAvatarUrl?.setValue(null);
  }

  private saveBioImageRecord() {
    this.userService.saveBioRecord(this.bioGroup?.value)
      .pipe(take(1))
      .subscribe({
        next: () => this.userData$ = this.getBioSocialRecord(true),
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic.actions.close'), 5000)
      })
  }

  private saveBioSocialRecord() {
    this.startLoadingMatStepperForm();
    this.userService.saveBioSocialRecord(this.form.value)
      .pipe(
        take(1),
        finalize(() => this.stopLoadingMatStepperForm())
      )
      .subscribe({
        next: () => {
          this.matSnackBarService.success(this.translateService.instant('bio.form.messages.success'), this.translateService.instant('generic.actions.close'), 5000);
          this.userData$ = this.getBioSocialRecord();
        },
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic.actions.close'), 5000)
      })
  }

  setMatStepperDoneMessage() {
    if (this.form.valid) {
      return this.translateService.instant('bio.form.steps.done.ready_to_save');
    }
    return this.translateService.instant('bio.form.steps.done.fill_all_fields');
  }

  existPreviousImage() {
    return this.avatarUrl?.value
  }

  private existChangesOnBioFormGroup() {
    return (this.bioGroup?.value?.presentation && this.bioGroup?.value?.presentation !== this.bio?.presentation)
      || (this.bioGroup?.value?.testimonial && this.bioGroup?.value?.testimonial !== this.bio?.testimonial)
      || (this.bioGroup?.value?.jobTitle && this.bioGroup?.value?.jobTitle !== this.bio?.jobTitle)
      || (this.bioGroup?.value?.fullName && this.bioGroup?.value?.fullName !== this.bio?.fullName);
  }

  private existChangesOnSocialFormGroup() {
    return (this.socialGroup?.value?.facebook && this.socialGroup?.value?.facebook !== this.social?.facebook)
      || (this.socialGroup?.value?.instagram && this.socialGroup?.value?.instagram !== this.social?.instagram)
      || (this.socialGroup?.value?.linkedin && this.socialGroup?.value?.linkedin !== this.social?.linkedin)
      || (this.socialGroup?.value?.github && this.socialGroup?.value?.github !== this.social?.github)
      || (this.socialGroup?.value?.twitter && this.socialGroup?.value?.twitter !== this.social?.twitter)
      || (this.socialGroup?.value?.youtube && this.socialGroup?.value?.youtube !== this.social?.youtube);
  }

  setAddEditAvatarHint() {
    if (this.existPreviousImage()) {
      return this.translateService.instant("bio.form.hints.edit_avatar");
    }
    return this.translateService.instant("bio.form.hints.add_avatar");
  }

  private startLoadingMatStepperForm() {
    this.isLoadingRequestMatStepperForm = true;
  }

  private stopLoadingMatStepperForm() {
    this.isLoadingRequestMatStepperForm = false;
  }

  get bioGroup() {
    return this.form.get('bio');
  }

  get socialGroup() {
    return this.form.get('social');
  }

  get avatarUrl() {
    return this.bioGroup?.get('avatarUrl');
  }

  get tempAvatarUrl() {
    return this.bioGroup?.get('tempAvatarUrl');
  }
}
