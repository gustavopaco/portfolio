import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragAndDropDirective} from "../../../diretivas/drag-and-drop.directive";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackbarService} from "../toast-snackbar/mat-snackbar.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {FileUploaderOptions} from "./file-uploader-options";

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, DragAndDropDirective, MatIconModule, MatExpansionModule, MatButtonModule, MatTooltipModule, TranslateModule, MatProgressBarModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent implements OnInit{

  @Input() translateService?: TranslateService;
  @Input() set config(value: FileUploaderOptions) {
    if (value.MULTIPLE_FILES === undefined) value.MULTIPLE_FILES = true;
    if (value.MAX_FILES === undefined) value.MAX_FILES = 5;
    if (value.MAX_FILE_SIZE === undefined) value.MAX_FILE_SIZE = 10;
    if (value.MIME_TYPES === undefined) value.MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    this._config = value;
  }
  private _config!: FileUploaderOptions;

  get config(): FileUploaderOptions {
    return this._config;
  }

  selectedFiles: {
    file: File,
    isUploadInProgress: boolean,
    uploadResult: any,
  }[] = [];

  constructor(private matSnackBarService: MatSnackbarService) {
  }

  ngOnInit(): void {
    console.log(this.config)
  }

  onFileDrop(fileList: File[]) {
    const validateFileList = this.validateFile(fileList);
    for (const file of validateFileList) {
      this.addToQueue(file);
    }
  }

  private addToQueue(file: File) {
    this.selectedFiles.push({
      file: file,
      isUploadInProgress: false,
      uploadResult: null,
    });
  }

  uploadFile(file: File) {
    console.log(file);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  validateFile(files: File[]) {
    //Validate Multiple Files
    if (this.isMultipleFilesAllowed(files)) {
      this.matSnackBarService.warning(this.translateService?.instant('file_uploader.multiple_files_not_allowed'), this.translateService?.instant('generic_messages.action_close'), 5000)
    }
    //Validate Max Files
    if (this.isMaxFilesExceeded()) {
      this.matSnackBarService.warning(this.translateService?.instant('file_uploader.max_files_exceeded', {maxFiles: this.config.MAX_FILES}), this.translateService?.instant('generic_messages.action_close'), 5000)
    }

    for (const file of files) {
      //Validate Duplicate File
      if (this.isDuplicateFile(file)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_already_selected', {fileName: file.name}), this.translateService?.instant('generic_messages.action_close'), 5000)
        files.splice(files.indexOf(file), 1);
        continue;
      }
      //Validate File Size in MB
      if (this.isFileSizeExceeded(file)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_size_exceeded', {fileName: file.name, fileSize: this.config.MAX_FILE_SIZE}), this.translateService?.instant('generic_messages.action_close'), 5000)
        files.splice(files.indexOf(file), 1);
      }
      //Validate File Type
      if (this.isFileMimeTypeAllowed(file)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_type_not_allowed', {fileName: file.name}), this.translateService?.instant('generic_messages.action_close'), 5000)
        files.splice(files.indexOf(file), 1);
      }
    }
    return files;
  }

  isDuplicateFile(file: File) {
    return this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name);
  }

  isFileSizeExceeded(file: File) {
    return file.size > this._config.MAX_FILE_SIZE * 1024 * 1024;
  }

  isFileMimeTypeAllowed(file: File) {
    return this._config.MIME_TYPES.includes(file.type);
  }

  isMultipleFilesAllowed(files: File[]) {
    return !this._config.MULTIPLE_FILES && files.length > 1;
  }

  isMaxFilesExceeded() {
    return this._config.MAX_FILES && this.selectedFiles.length >= this._config.MAX_FILES;
  }
}
