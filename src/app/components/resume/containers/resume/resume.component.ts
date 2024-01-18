import {Component, DestroyRef, ElementRef, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {UserService} from "../../../../shared/services/user.service";
import {catchError, finalize, map, Observable, Subject, switchMap, take, throwError} from "rxjs";
import {Resume} from "../../../../shared/interface/resume";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {AlertComponent} from "../../../../shared/external/bootstrap/alert/alert.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ResumeItemComponent} from "../../components/resume-item/resume-item.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FileUploaderService} from "../../../../shared/external/angular-material/file-uploader/file-uploader.service";
import {API_UPLOAD, S3_RESUME_FOLDER} from "../../../../shared/constants/api";
import {HttpParams} from "@angular/common/http";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, AlertComponent, TranslateModule, ResumeItemComponent, MatButtonModule, MatIconModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent {

  readonly MAX_FILE_SIZE_MB = 10;
  readonly ALLOWED_MIME_TYPE = 'application/pdf';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  resume$: Observable<Resume>
  resumeNotFound$: Subject<boolean> = new Subject<boolean>();
  resumeErrorMessage: string;

  destroyRef = inject(DestroyRef);

  constructor(private userService: UserService,
              private matSnackbarService: MatSnackbarService,
              private translateService: TranslateService,
              private fileUploadService: FileUploaderService) {
    this.resume$ = this.getResumeRecord();
    this.resumeErrorMessage = this.setResumeErrorMessage();
  }

  getResumeRecord() {
    return this.userService.getResumeRecord()
      .pipe(
        take(1),
        catchError((error: any) => {
          if (error.status === 404) {
            this.resumeNotFound$.next(true);
          } else {
            this.matSnackbarService.error(HttpValidator.validateResponseErrorMessage(error));
          }
          this.setResumeErrorMessage(error);
          return throwError(() => error);
        })
      );
  }

  onFileInputChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file && this.isValidMimeType(file) && this.isValidFileSize(file)) {
      this.uploadFile(file)
    }
  }

  addParamsToRequest() {
    return new HttpParams()
      .set('folder', S3_RESUME_FOLDER);
  }

  uploadFile(file: File) {
    this.fileUploadService.uploadFile(file, API_UPLOAD, this.addParamsToRequest())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        this.fileUploadService.fileUploadHttEventToUploadResult(),
        map((imageUrl: any) => {
          return {
            url: imageUrl,
            contentType: file.type,
          }
        }),
        switchMap((resume: Partial<Resume>) => this.saveResume(resume)),
        finalize(() => this.resetFileInput())
      )
      .subscribe({
        next: () => this.resume$ = this.getResumeRecord(),
        error: (error: any) => this.matSnackbarService.error(HttpValidator.validateResponseErrorMessage(error))
      })
  }

  saveResume(resume: Partial<Resume>) {
    return this.userService.saveResumeRecord(resume);
  }

  isValidMimeType(file: File) {
    if (file.type !== this.ALLOWED_MIME_TYPE) {
      this.matSnackbarService.error(this.translateService.instant('file_uploader.file_type_not_allowed', {
        fileName: file.name,
        allowedTypes: this.ALLOWED_MIME_TYPE
      }));
      return false;
    }
    return true;
  }

  isValidFileSize(file: File) {
    if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
      this.matSnackbarService.error(this.translateService.instant('file_uploader.file_size_exceeded', {
        fileName: file.name,
        fileSize: this.MAX_FILE_SIZE_MB + 'MB'
      }));
      return false;
    }
    return true;
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  setResumeErrorMessage(error?: any) {
    if (error?.status === 404) {
      return this.translateService.instant('resume.no_resume_description');
    }
    return this.translateService.instant('resume.failed_to_load_resume_description');
  }
}
