import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Project} from "../../../../shared/interface/project";
import {getRibbonClass} from "../../../../shared/utils/project-status-to-ribbon-class";

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent {

  @Input() projects?: Project[] = [];
  @Output() projectClicked = new EventEmitter<number>();

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

  onProjectClicked(id: number) {
    this.projectClicked.emit(id);
  }
}
