import {Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {FileUploaderService} from "./file-uploader.service";
import {catchError, forkJoin, of} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, DragAndDropDirective, MatIconModule, MatExpansionModule, MatButtonModule, MatTooltipModule, TranslateModule, MatProgressBarModule],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {

  @Input() translateService?: TranslateService;
  @Input() set config(value: FileUploaderOptions) {
    if (value.MULTIPLE_FILES === undefined) value.MULTIPLE_FILES = true;
    if (value.MAX_FILES === undefined) value.MAX_FILES = 5;
    if (value.MAX_FILE_SIZE_MB === undefined) value.MAX_FILE_SIZE_MB = 10;
    if (value.ALLOWED_MIME_TYPES === undefined) value.ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
    this._config = value;
  }
  @Output() onUploadSuccess: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  _config!: FileUploaderOptions;

  selectedFiles: {
    file: File,
    isUploadInProgress: boolean,
    uploadProgress: number,
    uploadResult: any,
  }[] = [];

  DESTROY_REF = inject(DestroyRef);

  constructor(private matSnackBarService: MatSnackbarService,
              private fileUploaderService: FileUploaderService) {
  }

  onFileDrop(fileList: FileList) {
    const validFileList = this.validateFile(Array.from(fileList));
    validFileList.forEach(file => this.addToQueue(file));
  }

  onFileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const validFileList = this.validateFile(Array.from(files));
    validFileList.forEach(file => this.addToQueue(file));
    target.value = '';
  }

  private addToQueue(file: File) {
    this.selectedFiles.push({
      file: file,
      isUploadInProgress: false,
      uploadProgress: 0,
      uploadResult: null,
    });
  }

  upload$(file: File) {
    let params = new HttpParams();
    if (this.isS3Upload()) {
      params = this.addS3Params(params);
    }
    return this.fileUploaderService.uploadFile(file, this._config.API_URL!!, params)
      .pipe(
        takeUntilDestroyed(this.DESTROY_REF),
        this.fileUploaderService.fileUploadInProgress((porcentagemAtual: number) => {
          this.onFileUploadInProgress(file, porcentagemAtual);
        }),
        this.fileUploaderService.fileUploadProgressComplete((porcentagemAtual: number) => {
          this.onFileUploadProgressComplete(file, porcentagemAtual);
        }),
        this.fileUploaderService.fileUploadHttEventToUploadResult(),
        catchError((error: any) => {
          this.onFileUploadError(file, error);
          return of(error);
        })
      );
  }

  uploadSelectedFile(selectedFile: any) {
    if (!selectedFile.isUploadInProgress && !selectedFile.uploadResult) {
      this.upload$(selectedFile.file).subscribe({
        next: (response: any) => {
          this.onUploadSuccess.emit(Array.of(response));
        },
        error: (error) => {
          this.matSnackBarService.error(this.translateService?.instant('generic_messages.failed_to_upload_image'), this.translateService?.instant('generic_messages.action_close'), 5000);
        }
      });
    }
  }

  uploadAllFiles() {
    const uploadFiles$ = this.selectedFiles.map((selectedFile: any) => {
      if (!selectedFile.isUploadInProgress && !selectedFile.uploadResult) {
        const file = selectedFile.file;
        return this.upload$(file);
      }
      return null;
    }).filter(Boolean);

    if (uploadFiles$.length > 0) {
      forkJoin(uploadFiles$).subscribe({
        next: (response: any) => {
          this.onUploadSuccess.emit(response);
        },
        error: (error) => {
          this.matSnackBarService.error(this.translateService?.instant('generic_messages.failed_to_upload_image'), this.translateService?.instant('generic_messages.action_close'), 5000);
        }
      });
    }
  }

  isS3Upload() {
    return this._config.S3_OPTIONS !== undefined;
  }

  addS3Params(params: HttpParams) {
      if (this._config.S3_OPTIONS!.folder) {
        params = params.set('folder', this._config.S3_OPTIONS!.folder);
      }
    return params;
  }

  onFileUploadInProgress(file: File, porcentagemAtual: number) {
    const selectedFile = this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name);
    if (selectedFile) {
      selectedFile.isUploadInProgress = true;
      selectedFile.uploadProgress = porcentagemAtual;
    }
  }

  onFileUploadProgressComplete(file: File, porcentagemAtual: number) {
    const selectedFile = this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name);
    if (selectedFile && porcentagemAtual === 100) {
      selectedFile.isUploadInProgress = false;
      selectedFile.uploadProgress = porcentagemAtual;
      selectedFile.uploadResult = 'success'
    }
  }

  onFileUploadError(file: File, error: any) {
    const selectedFile = this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name);
    if (selectedFile) {
      selectedFile.uploadResult = error;
    }
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
      this.matSnackBarService.warning(this.translateService?.instant('file_uploader.max_files_exceeded', {maxFiles: this._config.MAX_FILES}), this.translateService?.instant('generic_messages.action_close'), 5000)
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
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_size_exceeded', {fileName: file.name, fileSize: this._config.MAX_FILE_SIZE_MB}), this.translateService?.instant('generic_messages.action_close'), 5000)
        files.splice(files.indexOf(file), 1);
      }
      //Validate File Type
      if (!this.isFileMimeTypeAllowed(file)) {
        this.matSnackBarService.warning(this.translateService?.instant('file_uploader.file_type_not_allowed', {fileName: file.name, allowedTypes: this.acceptedMimeType()}), this.translateService?.instant('generic_messages.action_close'), 5000)
        files.splice(files.indexOf(file), 1);
      }
    }
    return files;
  }

  isDuplicateFile(file: File) {
    return this.selectedFiles.find(selectedFile => selectedFile.file.name === file.name);
  }

  isFileSizeExceeded(file: File) {
    return file.size > this._config.MAX_FILE_SIZE_MB * 1024 * 1024;
  }

  isFileMimeTypeAllowed(file: File) {
    return this._config.ALLOWED_MIME_TYPES.includes(file.type);
  }

  isMultipleFilesAllowed(files: File[]) {
    return !this._config.MULTIPLE_FILES && files.length > 1;
  }

  isMaxFilesExceeded() {
    return this._config.MAX_FILES && this.selectedFiles.length >= this._config.MAX_FILES;
  }

  acceptedMimeType() {
    return this._config.ALLOWED_MIME_TYPES.join(' ');
  }

  fileName(selectedFile: any) {
    return selectedFile.file.name;
  }

  fileUploadProgress(selectedFile: any) {
    return selectedFile.uploadProgress;
  }

  existUploadResult(selectedFile: any) {
    return selectedFile?.uploadResult;
  }

  isUploadResultInProgress(selectedFile: any) {
    return selectedFile.isUploadInProgress;
  }

  isUploadResultNull(selectedFile: any) {
    return selectedFile?.uploadResult === null;
  }

  isUploadResultSuccess(selectedFile: any) {
    return selectedFile?.uploadResult && selectedFile?.uploadResult == 'success';
  }

  isUploadResultError(selectedFile: any) {
    return selectedFile?.uploadResult && selectedFile?.uploadResult != 'error';
  }
}
