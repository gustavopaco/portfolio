import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {Course} from "../../../../shared/interface/course";

@Component({
  selector: 'app-courses-form',
  standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent {

  @Input() courses: Course[] = [];
}
