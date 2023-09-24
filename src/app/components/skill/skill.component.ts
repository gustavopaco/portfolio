import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {Skill} from "../../shared/interface/skill";

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {
  skillSelected = -1;
  @Input() skills?: Skill[];
  @Input() editable = false;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  starCount = 5;
  starArr: number[] = [];

  ngOnInit(): void {
    this.createStarArray();
  }

  private createStarArray() {
    for (let i = 0; i < this.starCount; i++) {
      this.starArr.push(i);
    }
  }

  showStarIcon(i: number, j: number) {
    if (this.skills && this.skills[j].rating >= i + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  onSkillSelected(j: number) {
    if (this.skills && this.editable) {
      if (j === this.skillSelected) {
        this.skillSelected = -1;
        this.edit.emit(-1);
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
