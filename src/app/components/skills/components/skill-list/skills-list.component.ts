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
  skillIdSelected = -1;
  @Input() skills?: Skill[];
  @Input('desktopView') isDesktop = false;
  @Input() editable = false;
  @Input() set isSkillSelected(value: boolean) {if (!value) this.skillIdSelected = -1;};
  @Output() selected = new EventEmitter();
  @Output() delete = new EventEmitter();
  isDeleteEvent = false;

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
