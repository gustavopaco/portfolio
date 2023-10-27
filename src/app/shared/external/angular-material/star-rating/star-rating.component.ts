import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() starCount = 5;
  @Input() starColor: ThemePalette = 'accent';
  @Input() rating = 0;
  @Input() editable = false;
  @Input('desktopView') isDesktop = false;
  @Output() ratingChange = new EventEmitter<number>();

  starArray: number[] = [];

  ngOnInit(): void {
   this.createStarArray();
  }

  private createStarArray() {
    for (let i = 0; i < this.starCount; i++) {
      this.starArray.push(i);
    }
  }

  starIcon(i: number) {
    return this.rating >= i + 1 ? 'star' : 'star_border';
  }

  tooltip(i: number) {
    return `${i + 1} stars`;
  }

  onClick(i: number) {
    this.rating = i + 1;
    this.ratingChange.emit(this.rating);
  }
}
