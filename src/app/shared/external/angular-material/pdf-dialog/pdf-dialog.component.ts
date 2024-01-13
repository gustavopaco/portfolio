import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogContent} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SwiperDirective} from "../../../diretivas/swiper.directive";
import {SwiperContainer} from "swiper/element";
import {SwiperOptions} from "swiper/types";

export interface PdfDialogData {
  url: string;
  title: string;
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
    pagination: {
      enabled: true,
      clickable: true,
      dynamicBullets: true,
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: PdfDialogData[]) {
    this.position = 0;
    this.totalElements = data.length;
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
