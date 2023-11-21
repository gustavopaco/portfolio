import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Course} from "../../../../shared/interface/course";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {FormValidator} from "../../../../shared/validator/form-validator";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormularioDebugComponent} from "../../../../shared/components/formulario-debug/formulario-debug.component";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-courses-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FormularioDebugComponent, MatDividerModule],
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit {

  form: FormGroup = this.fb.group({
    courses: this.fb.array([])
  })

  @Input() courses: Course[] = [];

  maxEndDate = new Date();

  constructor(private fb: FormBuilder,
              private translateService: TranslateService) {
  }

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
    this.coursesFormArray.push(coursesFormGroup);
  }

  removeCourse(index: number) {
    this.coursesFormArray.removeAt(index);
  }

  get coursesFormArray() {
    return this.form.get('courses') as FormArray;
  }

  onSubmit() {

  }

  matErrorMessage(formControlName: string, fieldName: string, index: number) {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl> this.coursesFormArray.controls[index].get(formControlName), fieldName);
  }

  onAddNewCourse(alertEl?: HTMLDivElement) {
    if (alertEl) alertEl.hidden = true;
    this.addCourse();
  }
}
