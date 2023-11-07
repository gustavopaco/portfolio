import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Project} from "../../../../shared/interface/project";
import {getRibbonClass} from "../../../../shared/utils/project-status-to-ribbon-class";
import {SwiperOptions} from "swiper/types";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SwiperDirective} from "../../../../shared/diretivas/swiper.directive";
import {SwiperContainer} from "swiper/element";
import {StatusProjectPipe} from "../../../../shared/pipe/status-project.pipe";

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, SwiperDirective, StatusProjectPipe],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsListComponent {

  @Input() projects?: Project[] = [];
  @Output() projectClicked = new EventEmitter<number>();
  @ViewChild('swiperRef') swiperRef!: ElementRef<SwiperContainer>;

  activeIndex: number = 0;
  numberOfSlides: number = 0;

  swiperConfig: SwiperOptions = {
    centeredSlides: true,
    observer: true,
    observeParents: true,
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    slidesPerView: 3,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: 80,
      modifier: 1,
      depth: 200,
      slideShadows: true,
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      }
    },
    on: {
      paginationRender: (swiper, paginationContainer) => {
        this.numberOfSlides = swiper.slides.length;
      },
      slideChange: (swiper) => {
        this.activeIndex = swiper.activeIndex;
      }
    }
  }

  setImageCardSrc(project: Project): string {
    if (project?.pictureUrl) {
      return project.pictureUrl;
    }
    return 'assets/backgrounds/under-construction.jpg';
  }

  /** @description This function is used in the template to set the ribbon color based on the project status.
   *
   * IN_PROGRESS: in-progress,
   * UNDER_REVIEW: under-review,
   * LAUNCHED: launched,
   * EMERGENCY: emergency,
   * MAINTENANCE: maintenance,
   * FUTURE: future,
   * PAUSED: paused,
   * HIGHLIGHT: highlight,
   * OLD: old
   * */
  setRibbonColor(project: Project) {
    return getRibbonClass(project.status);
  }

  onProjectClicked(id: number, index: number) {
    if (index === this.activeIndex) {
      this.projectClicked.emit(id);
    }
  }

  moveToBackSlide() {
    this.swiperRef?.nativeElement.swiper.slidePrev();
  }

  moveToNextSlide() {
    this.swiperRef?.nativeElement.swiper.slideNext();
  }

  addSlide() {
    this.projects?.push({
      id: 10,
      name: 'Teste',
      description: 'Teste',
      status: 'IN_PROGRESS',
      pictureUrl: 'assets/backgrounds/under-construction.jpg',
      url: 'https://www.google.com',
      pictureOrientation: 'LANDSCAPE'
    })
    setTimeout(() => {
    this.swiperRef?.nativeElement.swiper.update();
    })
  }
}
