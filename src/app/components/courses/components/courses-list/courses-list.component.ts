import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Course} from "../../../../shared/interface/course";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, MatCardModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss'
})
export class CoursesListComponent {

  @Input() courses?: Course[] = [];
}
