import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileUploaderComponent
} from "../../../../shared/external/angular-material/file-uploader/file-uploader.component";
import {TranslateService} from "@ngx-translate/core";
import {FileUploaderOptions} from "../../../../shared/external/angular-material/file-uploader/file-uploader-options";
import {API_UPLOAD, S3_CERTIFICATES_FOLDER} from "../../../../shared/constants/api";

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

  constructor(public translateService: TranslateService) {
    this.config.S3_OPTIONS = this.s3Options;
  }

  onUploadSuccess(imageUrls: string[]) {
    console.log(imageUrls);
  }
}
