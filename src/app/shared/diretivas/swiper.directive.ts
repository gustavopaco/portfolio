import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element";

@Directive({
  selector: '[swiper]',
  standalone: true
})
export class SwiperDirective implements AfterViewInit {
  @Input() config?: SwiperOptions;

  constructor(private el: ElementRef<SwiperContainer>) {}

  ngAfterViewInit(): void {
    Object.assign(this.el.nativeElement, this.config);
    this.el.nativeElement.initialize();
  }
}
