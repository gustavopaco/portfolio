import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Project} from "../../../../shared/interface/project";

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent {

  projects: Project[] = [];

  setImageCardSrc(project: Project): string {
    if (project.status !== 'In Progress' && project.url) {
      return project.url;
    }
    return 'assets/backgrounds/under-construction.jpg';
  }

  /** @description This function is used in the template to set the ribbon color based on the project status.
   *
   * In Progress: in-progress,
   * Under Review: under-review,
   * Launched: launched,
   * Emergency: emergency,
   * Maintenance: maintenance,
   * Future: future,
   * Paused: paused,
   * Highlight: highlight,
   * Old: old
   * */
  setRibbonColor(project: Project) {
    switch (project.status) {
      case 'In Progress': return 'in-progress';
      case 'Under Review': return 'under-review';
      case 'Launched': return 'launched';
      case 'Emergency': return 'emergency';
      case 'Maintenance': return 'maintenance';
      case 'Future': return 'future';
      case 'Paused': return 'paused';
      case 'Highlight': return 'highlight';
      case 'Old': return 'old';
      default: return '';
    }
  }
}
