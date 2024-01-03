import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogContent} from "@angular/material/dialog";

@Component({
  selector: 'app-pdf-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent],
  templateUrl: './pdf-dialog.component.html',
  styleUrl: './pdf-dialog.component.scss'
})
export class PdfDialogComponent {

  iframeSrc: string = '';
  title: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.iframeSrc = data.url;
    this.title = data.title;
    console.log('iframeSrc', this.iframeSrc);
  }
}
