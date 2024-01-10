import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Certificate} from "../../../../shared/interface/certificate";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogContainer, MatDialogModule} from "@angular/material/dialog";
import {PdfDialogComponent} from "../../../../shared/external/angular-material/pdf-dialog/pdf-dialog.component";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from "../../../../shared/external/angular-material/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-certificates-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogContainer, MatDialogModule, MatIconModule, TranslateModule, MatTooltipModule],
  templateUrl: './certificates-list.component.html',
  styleUrl: './certificates-list.component.scss'
})
export class CertificatesListComponent {

  @Input() certificates: Certificate[] = [];
  @Output() onDeleteCertificate: EventEmitter<number> = new EventEmitter<number>

  constructor(private matDialog: MatDialog,
              private sanitizer: DomSanitizer,
              private translateService: TranslateService) {
  }

  openCertificate(url: string) {
    const pdfDialogData = {
      url: this.sanitizeUrl(url),
      title: this.translateService.instant('portfolio.certificates')
    }
    this.matDialog.open(PdfDialogComponent, {
      width: '80%',
      height: '800px',
      data: pdfDialogData
    });
  }

  deleteCertificate(id: number) {
    const certificate = this.certificates.find(certificate => certificate.id === id);
    const fullFileName = this.fullFileName(certificate!.url);

    const confirmationDialogData: ConfirmationDialogData = {
      title: this.translateService.instant('certificates.delete_certificate_title'),
      message: this.translateService.instant('certificates.delete_certificate_message', {certificateName: fullFileName}),
      btnConfirmLabel: this.translateService.instant('certificates.delete_certificate_confirm'),
      btnCancelLabel: this.translateService.instant('certificates.delete_certificate_cancel')
    }

    const dialofRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '400px',
      maxHeight: '700px',
      disableClose: true,
      data: confirmationDialogData
    });

    dialofRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteCertificate.emit(id);
      }
    });
  }

  decodeUrl(url: string) {
    let fileName = url.split('_')[1].replace('.pdf', '')
    return decodeURIComponent(fileName);
  }

  fullFileName(url: string) {
    return this.decodeUrl(url) + '.pdf';
  }

  shortFileName(url: string) {
    let fileName = this.decodeUrl(url);
    return fileName.length > 10 ? fileName.substring(0, 10) + '...' : fileName;
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
