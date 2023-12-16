import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragAndDropDirective} from "../../../diretivas/drag-and-drop.directive";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackbarService} from "../toast-snackbar/mat-snackbar.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, DragAndDropDirective, MatIconModule, MatExpansionModule, MatButtonModule, MatTooltipModule, TranslateModule, MatProgressBarModule],
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
  selectedFiles: {
    file: File,
    isUploadInProgress: boolean,
    uploadResult: any,
  }[] = [];

  constructor(private matSnackBarService: MatSnackbarService) {
  }

  onFileDrop(fileList: File[]) {
    this.validateFile(fileList);
  }

  uploadFile(file: File) {
    console.log(file);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  validateFile(files: File[]) {
    for (const file of files) {
      //Validate Duplicate File
      if (this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_already_selected', {fileName: file.name}), this.translateService?.instant('generic_messages.action_close'), 5000)
        continue;
      }
      //Validate File Size in MB
      if (file.size > this.config.MAX_FILE_SIZE * 1024 * 1024) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_size_exceeded', {fileName: file.name, fileSize: this.config.MAX_FILE_SIZE}), this.translateService?.instant('generic_messages.action_close'), 5000)
      }
      //Validate File Type
      if (!this.config.MIME_TYPES.includes(file.type)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_type_not_allowed', {fileName: file.name}), this.translateService?.instant('generic_messages.action_close'), 5000)
      }
      //Validate Multiple Files
      if (!this.config.MULTIPLE_FILES && files.length > 1) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.multiple_files_not_allowed'), this.translateService?.instant('generic_messages.action_close'), 5000)
      }
      //Validate Max Files
      if (this.config.MAX_FILES && this.selectedFiles.length >= this.config.MAX_FILES) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.max_files_exceeded', {maxFiles: this.config.MAX_FILES}), this.translateService?.instant('generic_messages.action_close'), 5000)
      }
      this.selectedFiles.push({
        file: file,
        isUploadInProgress: false,
        uploadResult: undefined
      });
    }
  }
}
