import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShapeDividerService} from "./shape-divider.service";

export interface ShapeDividerPath {
  d: string;
  opacity: number;
}

@Component({
  selector: 'app-shape-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shape-divider.component.html',
  styleUrl: './shape-divider.component.scss'
})
export class ShapeDividerComponent implements OnInit, AfterViewInit {

  @Input() shape: 'waves' | 'waves-opacity' | 'curve' | 'curve-asymmetrical' | 'triangule' | 'triangule-asymmetrical' | 'tilt' | 'arrow' | 'split' | 'book' = 'waves';
  @Input() baseHeight: number = 50;
  @Input() svgHeight: number = 150;
  @Input() svgWidth: number = 100;
  @Input() bottom: boolean = false;
  @Input() flip: boolean = false;
  @Input() inverted: boolean = false;
  @Input() hexaColor: string = '#ffffff';
  @ViewChild('shapeDivider') shapeDivider!: ElementRef;
  @ViewChild('svgDivider') svgDivider!: ElementRef;

  paths: ShapeDividerPath[] = [];

  constructor(private shapeDividerService: ShapeDividerService) {
  }

  ngOnInit(): void {
    this.paths = this.getPaths();
  }

  ngAfterViewInit(): void {
    if (this.bottom) {
      this.shapeDivider.nativeElement.style.bottom = `${this.baseHeight}px`;
    } else {
      this.shapeDivider.nativeElement.style.top = `${this.baseHeight}px`;
    }
    this.svgDivider.nativeElement.style.width = `calc(${this.svgWidth}% + 1.3px)`; // 1.3px is the border width
  }

  setShapeDividerNgClass() {
    switch (this.shape) {
      case 'waves-opacity' || 'tilt':
        return {
          'bottom-divider inverted': this.bottom,
        };
      default:
        return {
          'bottom-divider': this.bottom,
          'inverted': (this.bottom && !this.inverted) || (!this.bottom && this.inverted),
        };
    }
  }

  setSvgDividerNgClass() {
    switch (this.shape) {
      case 'waves' || 'waves-opacity' || 'curve-asymmetrical'  || 'triangule-asymmetrical' || 'tilt':
        return {
          'flip': this.flip,
        };
      default:
        return {};
    }
  }

  getPaths(): ShapeDividerPath[] {
    return this.shapeDividerService.getShapeDividerPath(this.shape, this.inverted);
  }
}
