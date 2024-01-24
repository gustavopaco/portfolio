import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Resume} from "../../../../shared/interface/resume";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  PdfDialogComponent,
  PdfDialogData
} from "../../../../shared/external/angular-material/pdf-dialog/pdf-dialog.component";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from "../../../../shared/external/angular-material/confirmation-dialog/confirmation-dialog.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {take} from "rxjs";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-resume-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule, TranslateModule],
  templateUrl: './resume-item.component.html',
  styleUrl: './resume-item.component.scss'
})
export class ResumeItemComponent {

  @Input() resume!: Resume;
  @Output() onDeleteResume: EventEmitter<number> = new EventEmitter<number>();

  constructor(private matDialog: MatDialog,
              private translateService: TranslateService) {
  }

  isContentTypePdf(contentType: string) {
    return contentType === 'application/pdf';
  }

  fullName(url: string) {
    return url.split('_').pop();
  }

  openResume() {
    const pdfDialogData: PdfDialogData = {
      url: this.resume.url,
      title: 'Resume'
    }
    this.matDialog.open(PdfDialogComponent, {
      width: '100%',
      height: '90vh',
      data: [pdfDialogData]
    });
  }

  deleteResume() {
    const confirmationDialogData: ConfirmationDialogData = {
      title: this.translateService.instant('resume.delete_resume_title'),
      message: this.translateService.instant('resume.delete_resume_message'),
      btnConfirmLabel: this.translateService.instant('resume.delete_resume_confirm'),
      btnCancelLabel: this.translateService.instant('resume.delete_resume_cancel')
    }
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      data: confirmationDialogData
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.onDeleteResume.emit(this.resume.id);
        }
      });
  }
}
