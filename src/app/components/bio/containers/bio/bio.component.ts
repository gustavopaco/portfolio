import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BioAvatarComponent} from "../../components/bio-avatar/bio-avatar.component";
import {UserService} from "../../../../shared/services/user.service";
import {finalize, take} from "rxjs";
import {Bio} from "../../../../shared/interface/bio";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {ACTION_CLOSE, FAILED_TO_DELETE_STORED_IMAGE} from "../../../../shared/constants/constants";
import {S3_AVATAR_FOLDER} from "../../../../shared/constants/api";
import {HttpValidator} from "../../../../shared/validator/http-validator";

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, BioAvatarComponent, MatProgressSpinnerModule, MatToolbarModule],
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit {

  bio?: Bio;

  isLoadingBio = true;

  constructor(private userService: UserService,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service,
              private matSnackBarService: MatSnackbarService) {
  }

  ngOnInit(): void {
    this.getBioRecord();
  }

  private getBioRecord() {
    this.onRequestLoadingBio();
    this.userService.getBioRecord()
      .pipe(
        take(1),
        finalize(() => this.isLoadingBio = false)
      )
      .subscribe((response: Bio) => this.bio = response);
  }

  private onRequestLoadingBio() {
    this.isLoadingBio = true;
  }

  onImageChange(file: File) {
    this.loadCredentials(file);
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
        error: (error: any) => this.matSnackBarService.error(error, ACTION_CLOSE, 5000)
      })
  }

  private existPreviousImage() {
    return this.bio?.avatarUrl;
  }

  private deletePreviousImage(credentials: AwsConfiguration, file: File) {
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(credentials.bucketName, this.bio!.avatarUrl)
      .then(() => this.uploadToAwsS3Bucket(credentials, file))
      .catch(() => this.matSnackBarService.error(FAILED_TO_DELETE_STORED_IMAGE, ACTION_CLOSE, 5000))
  }

  private uploadToAwsS3Bucket(credentials: AwsConfiguration, file: File) {
    this.utilAwsS3Service.uploadSingleImageToAwsS3Bucket(credentials.bucketName, file, S3_AVATAR_FOLDER)
      .then((imageUrl: string) => {
        this.bio = {...this.bio!, avatarUrl: imageUrl};
        this.saveBioRecord();
      })
      .catch((error: any) => this.matSnackBarService.error(error, ACTION_CLOSE, 5000))
  }

  private saveBioRecord() {
    this.userService.saveBioRecord(this.bio!)
      .pipe(take(1))
        .subscribe({
          next: () => this.getBioRecord(),
          error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000)
        })
  }
}
