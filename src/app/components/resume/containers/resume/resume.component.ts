import {Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {UserService} from "../../../../shared/services/user.service";
import {catchError, finalize, map, Observable, Subject, take, throwError} from "rxjs";
import {Resume} from "../../../../shared/interface/resume";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {AlertComponent} from "../../../../shared/external/bootstrap/alert/alert.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ResumeItemComponent} from "../../components/resume-item/resume-item.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {LoadingDialogService} from "../../../../shared/external/angular-material/loading-dialog/loading-dialog.service";

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
  readonly RESUME_NOT_FOUND = 'RESUME_NOT_FOUND';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  resume$: Observable<Resume>
  resumeNotFound$: Subject<boolean> = new Subject<boolean>()
  resumeErrorMessage: string;

  constructor(private userService: UserService,
              private matSnackbarService: MatSnackbarService,
              private translateService: TranslateService,
              private loadingDialogService: LoadingDialogService) {
    this.resume$ = this.getResumeRecord();
    this.resumeErrorMessage = this.setResumeErrorMessage();
  }

  getResumeRecord() {
    return this.userService.getResumeRecord()
      .pipe(
        take(1),
        map((resume: Resume) => {
          if (resume === null) {
            throw new Error(this.RESUME_NOT_FOUND);
          }
          return resume;
        }),
        catchError((error: Error) => {
          if (error.message != this.RESUME_NOT_FOUND) {
            this.matSnackbarService.error(HttpValidator.validateResponseErrorMessage(error));
          }
          this.resumeNotFound$.next(true);
          this.resumeErrorMessage = this.setResumeErrorMessage(error.message);
          return throwError(() => error);
        })
      );
  }

  onFileInputChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (file && this.isValidMimeType(file) && this.isValidFileSize(file)) {
      this.saveResume(file)
    } else {
      this.resetFileInput();
    }
  }

  saveResume(file: File) {
    const loadingDialogRef = this.loadingDialogService.openLoadingDialog({
      message: this.translateService.instant('resume.saving_resume'),
      mode: 'spinner-text'
    });
    this.userService.saveResumeRecord(file)
      .pipe(
        take(1),
        finalize(() => {
          this.resetFileInput();
          loadingDialogRef.close();
        })
      )
      .subscribe({
        next: () => this.resume$ = this.getResumeRecord(),
        error: (error: any) => this.matSnackbarService.error(HttpValidator.validateResponseErrorMessage(error))
      });
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

  setResumeErrorMessage(message?: any) {
    if (message == this.RESUME_NOT_FOUND) {
      return this.translateService.instant('resume.no_resume_description');
    }
    return this.translateService.instant('resume.failed_to_load_resume_description');
  }

  onDeleteResume(id: number) {
    const loadingDialogRef = this.loadingDialogService.openLoadingDialog({
      message: this.translateService.instant('resume.delete_resume_loading'),
      mode: 'spinner-text'
    });
    this.userService.deleteResumeRecord(id)
      .pipe(
        take(1),
        finalize(() => loadingDialogRef.close())
      )
      .subscribe({
        next: () => {
          this.matSnackbarService.success(this.translateService.instant('resume.delete_resume_success'));
          this.resume$ = this.getResumeRecord();
        },
        error: (error: any) => this.matSnackbarService.error(HttpValidator.validateResponseErrorMessage(error))
      });
  }
}
