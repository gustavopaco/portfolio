import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileUploaderComponent
} from "../../../../shared/external/angular-material/file-uploader/file-uploader.component";

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FileUploaderComponent],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {

}
