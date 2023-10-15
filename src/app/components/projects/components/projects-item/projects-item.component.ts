import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Project} from "../../../../shared/interface/project";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {StatusProjectPipe} from "../../../../shared/pipe/status-project.pipe";
import {getRibbonClass} from "../../../../shared/utils/project-status-to-ribbon-class";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

export interface ProjectItemData {
  project: Project;
  editable: boolean;
}

@Component({
  selector: 'app-projects-item',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatDialogModule, StatusProjectPipe, MatButtonModule, MatIconModule],
  templateUrl: './projects-item.component.html',
  styleUrls: ['./projects-item.component.scss']
})
export class ProjectsItemComponent {

  constructor(private matDialogRef: MatDialogRef<ProjectsItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProjectItemData) {
  }

  setProjectImage() {
    if (this.data.project.pictureUrl) {
      return this.data.project.pictureUrl;
    }
    return 'assets/backgrounds/under-construction.jpg';
  }

  setRibbonColor() {
    return getRibbonClass(this.data.project.status);
  }

  onEdit() {
    this.matDialogRef.close({action: 'edit', project: this.data.project});
  }
}
