import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileUploaderComponent
} from "../../../../shared/external/angular-material/file-uploader/file-uploader.component";
import {TranslateService} from "@ngx-translate/core";
import {FileUploaderOptions} from "../../../../shared/external/angular-material/file-uploader/file-uploader-options";

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FileUploaderComponent],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {

  config: FileUploaderOptions = {
    MAX_FILE_SIZE: 10,
    MIME_TYPES: ['application/pdf'],
    MULTIPLE_FILES: true,
    MAX_FILES: 5,
    data: null
  }

  constructor(public translateService: TranslateService) {
  }
}
