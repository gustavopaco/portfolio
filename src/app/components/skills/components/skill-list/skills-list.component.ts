import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {Skill} from "../../../../shared/interface/skill";
import {StarRatingComponent} from "../../../../shared/external/angular-material/star-rating/star-rating.component";
import {SwiperDirective} from "../../../../shared/diretivas/swiper.directive";
import {SwiperContainer} from "swiper/swiper-element";
import {SwiperOptions} from "swiper/types";

@Component({
    selector: 'app-skills-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, StarRatingComponent, SwiperDirective],
    templateUrl: './skills-list.component.html',
    styleUrls: ['./skills-list.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkillsListComponent implements AfterViewInit {
    @Input() skills?: Skill[];
    @Input('desktopView') isDesktop = false;
    @Input() editable = false;
    @Input() set isSkillSelected(value: boolean) {
        if (!value) this.skillIdSelected = -1;
    };

    @Output() selected = new EventEmitter();
    @Output() delete = new EventEmitter();

    @ViewChild('swiperRef') swiperRef?: ElementRef<SwiperContainer>;

    swiperConfig: SwiperOptions = {
        navigation: false,
        grabCursor: true,
        pagination: {
            clickable: false,
            dynamicBullets: true,
        },
        autoplay: {
            delay: 500,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
                grid: {
                    rows: 1,
                    fill: 'row'
                },
                speed: 1500,
            },
            540: {
                slidesPerView: 2,
                spaceBetween: 10,
                speed: 3000,
                grid: {
                    rows: 2,
                    fill: 'row'
                },
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 10,
                speed: 3000,
                grid: {
                    rows: 2,
                    fill: 'row'
                },
            },
            1200: {
                slidesPerView: 4,
                speed: 4000,
                grid: {
                    rows: 2,
                    fill: 'row'
                },
            }
        },
    }

    skillIdSelected = -1;
    isDeleteEvent = false;

  ngAfterViewInit(): void {
    if (this.editable) {
      this.swiperRef?.nativeElement.swiper.autoplay.stop();
    }
  }

    onSkillSelected(j: number) {
        if (this.skills && this.editable) {
            if (j === this.skillIdSelected && !this.isDeleteEvent) {
                this.skillIdSelected = -1;
                this.selected.emit(-1);
                return;
            }
            this.isDeleteEvent = false;
            this.skillIdSelected = j;
            this.selected.emit(this.skills[j].id);
        }
    }

    onDelete(j: number) {
        if (this.skills && this.editable) {
            this.isDeleteEvent = true;
            this.delete.emit(this.skills[j].id);
        }
    }
}
