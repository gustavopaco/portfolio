import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogContent} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SwiperDirective} from "../../../diretivas/swiper.directive";
import {SwiperContainer} from "swiper/element";
import {SwiperOptions} from "swiper/types";
import {DomSanitizer} from "@angular/platform-browser";

export interface PdfDialogData {
  url: string;
  title: string;
  safeUrl?: any;
}

@Component({
  selector: 'app-pdf-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatButtonModule, MatIconModule, SwiperDirective],
  templateUrl: './pdf-dialog.component.html',
  styleUrl: './pdf-dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PdfDialogComponent {

  title: string = '';
  position: any;
  totalElements: any;

  @ViewChild('swiperRef') swiperRef!: ElementRef<SwiperContainer>;

  swiperConfig: SwiperOptions = {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 0,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      slideChange: (swiper) => {
        this.position = swiper.activeIndex
      }
    }
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: PdfDialogData[],
              private domSanitizer: DomSanitizer) {
    this.position = 0;
    this.totalElements = data.length;
    this.data.map((pdfDialogData: PdfDialogData) => {
      pdfDialogData.safeUrl = this.sanitizePdfUrl(pdfDialogData.url);
    });
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

  sanitizePdfUrl(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
