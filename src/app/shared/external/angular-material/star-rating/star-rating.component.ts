import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ThemePalette} from "@angular/material/core";
import {TranslateService} from "@ngx-translate/core";

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

  constructor(private translateService: TranslateService) { }

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
    if (this.translateService.currentLang === 'pt') {
      return (i + 1 > 1) ? `${i + 1} estrelas` : `${i + 1} estrela`;
    }
    return (i + 1 > 1) ? `${i + 1} stars` : `${i + 1} star`;
  }

  onClick(i: number) {
    this.rating = i + 1;
    this.ratingChange.emit(this.rating);
  }
}
