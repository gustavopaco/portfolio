import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FileUploaderComponent
} from "../../../../shared/external/angular-material/file-uploader/file-uploader.component";
import {TranslateService} from "@ngx-translate/core";
import {FileUploaderOptions} from "../../../../shared/external/angular-material/file-uploader/file-uploader-options";
import {API_UPLOAD, S3_CERTIFICATES_FOLDER} from "../../../../shared/constants/api";
import {UserService} from "../../../../shared/services/user.service";
import {take} from "rxjs";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FileUploaderComponent],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {

  config: FileUploaderOptions = {
    API_URL: API_UPLOAD,
    MAX_FILE_SIZE_MB: 10,
    ALLOWED_MIME_TYPES: ['application/pdf'],
    MULTIPLE_FILES: true,
    MAX_FILES: 5,
    DATA: null
  }

  s3Options = {
    folder: S3_CERTIFICATES_FOLDER
  }

  constructor(public translateService: TranslateService,
              private userService: UserService,
              private matSnackBarService: MatSnackbarService) {
    this.config.S3_OPTIONS = this.s3Options;
  }

  onUploadSuccess(imageUrls: string[]) {
    const certificates = this.mapToCertificates(imageUrls);
    this.saveCertificates(certificates);
  }

  mapToCertificates(imageUrls: string[]) {
    return imageUrls.map(imageUrls => {
      return {
        id: null,
        url: imageUrls
      }
    })
  }

  saveCertificates(certificates: any[]) {
    this.userService.saveCertificates(certificates)
      .pipe(
        take(1)
      )
      .subscribe({
        error: (error: any) => {
          this.matSnackBarService.error(
            HttpValidator.validateResponseErrorMessage(error),
            this.translateService.instant('generic_messages.action_close'),
            3000)
        }
      })
  }
}
