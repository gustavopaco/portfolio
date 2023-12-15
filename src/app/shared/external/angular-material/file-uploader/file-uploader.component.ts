import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragAndDropDirective} from "../../../diretivas/drag-and-drop.directive";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackbarService} from "../toast-snackbar/mat-snackbar.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, DragAndDropDirective, MatIconModule, MatExpansionModule, MatButtonModule, MatTooltipModule, TranslateModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {

  @Input() translateService?: TranslateService;
  @Input() config!: {
    API_URL: string,
    MAX_FILE_SIZE: number,
    MIME_TYPES: string[],
    MULTIPLE_FILES: boolean,
    MAX_FILES: number,
    data: any
  };
  selectedFiles : {
    file: File,
    isUploadInProgress: boolean,
    isUploaded: boolean,
  }[] = [];

  constructor(private matSnackBarService: MatSnackbarService) {
  }

  onFileDrop(fileList: File[]) {
    for (const file of fileList) {
      if (this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_already_selected', {fileName: file.name}), this.translateService?.instant('generic_messages.action_close'), 5000)
        continue;
      }
      this.selectedFiles.push({
        file: file,
        isUploadInProgress: false,
        isUploaded: false,
      });
    }
  }

  uploadFile(file: File) {
    console.log(file);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
}
