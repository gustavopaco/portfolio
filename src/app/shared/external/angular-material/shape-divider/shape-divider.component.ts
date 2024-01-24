import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shape-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shape-divider.component.html',
  styleUrl: './shape-divider.component.scss'
})
export class ShapeDividerComponent implements AfterViewInit  {

  @Input() baseHeight: number = 50;
  @Input() svgHeight: number = 150;
  @Input() svgWidth: number = 100;
  @Input() bottom: boolean = false;
  @Input() inverted: boolean = false;
  @Input() hexaColor: string = '#ffffff';
  @ViewChild('shapeDivider') shapeDivider!: ElementRef;
  @ViewChild('svgDivider') svgDivider!: ElementRef;

  ngAfterViewInit(): void {
    if (this.bottom) {
      this.shapeDivider.nativeElement.style.bottom = `${this.baseHeight}px`;
    } else {
      this.shapeDivider.nativeElement.style.top = `${this.baseHeight}px`;
    }
    this.svgDivider.nativeElement.style.width = `calc(${this.svgWidth}% + 1.3px)`; // 1.3px is the border width
  }


}
