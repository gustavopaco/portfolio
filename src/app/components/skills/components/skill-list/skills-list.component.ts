import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {Skill} from "../../../../shared/interface/skill";
import {StarRatingComponent} from "../../../../shared/external/angular-material/star-rating/star-rating.component";

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, StarRatingComponent],
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent {
  skillSelected = -1;
  @Input() skills?: Skill[];
  @Input() editable = false;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  onSkillSelected(j: number) {
    if (this.skills && this.editable) {
      if (j === this.skillSelected) {
        this.skillSelected = -1;
        this.edit.emit(-1);
        return;
      }
      this.skillSelected = j;
      this.edit.emit(this.skills[j].id);
    }
  }

  onDelete(j: number) {
    if (this.skills) {
      this.delete.emit(this.skills[j].id);
    }
  }
}
