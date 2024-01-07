import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogContent} from "@angular/material/dialog";

export interface PdfDialogData {
  url: string;
  title: string;
}

@Component({
  selector: 'app-pdf-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent],
  templateUrl: './pdf-dialog.component.html',
  styleUrl: './pdf-dialog.component.scss'
})
export class PdfDialogComponent implements OnInit {

  iframeSrc: string = '';
  title: string = '';
  position: any;
  totalElements: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PdfDialogData[]) {
    this.position = 0;
    this.totalElements = data.length;
  }

  ngOnInit(): void {
    this.start();
  }

  start() {
    this.iframeSrc = this.data[this.position].url;
    this.title = this.data[this.position].title;
  }

  next() {
    if (this.position < this.totalElements - 1) {
      this.position++;
      this.iframeSrc = this.data[this.position].url;
      this.title = this.data[this.position].title;
    }
  }

  previous() {
    if (this.position > 0) {
      this.position--;
      this.iframeSrc = this.data[this.position].url;
      this.title = this.data[this.position].title;
    }
  }

  isFirst() {
    return this.position === 0;
  }

  isLast() {
    return this.position === this.totalElements - 1;
  }

  isSingle() {
    return this.totalElements === 1;
  }

  isMultiple() {
    return this.totalElements > 1;
  }
}
