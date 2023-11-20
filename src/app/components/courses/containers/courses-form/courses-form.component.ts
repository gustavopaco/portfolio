import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {Course} from "../../../../shared/interface/course";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormArray, FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-courses-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatFormFieldModule],
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit{

  form: FormArray = this.fb.array([])
  @Input() courses: Course[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    if (this.courses.length > 0) {
      this.courses.forEach(course => this.addCourse(course))
    }
  }

  addCourse(course?: Course) {
    let coursesFormGroup = this.fb.group({
      id: new FormControl<number | undefined>(course?.id),
      name: [course?.name],
      issuer: [course?.issuer],
      endDate: new FormControl<Date | undefined>(course?.endDate)
    })
    this.form.push(coursesFormGroup);
  }

  removeCourse(index: number) {
    this.form.removeAt(index);
  }

  get coursesFormArray() {
    return this.form;
  }
}
