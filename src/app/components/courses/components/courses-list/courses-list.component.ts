import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Course} from "../../../../shared/interface/course";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss'
})
export class CoursesListComponent {

  @Input() courses: Course[] = [];
}
