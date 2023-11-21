import {Component, Inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Course} from "../../../../shared/interface/course";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {FormValidator} from "../../../../shared/validator/form-validator";
import {MatDatepicker, MatDatepickerIntl, MatDatepickerModule} from "@angular/material/datepicker";
import {FormularioDebugComponent} from "../../../../shared/components/formulario-debug/formulario-debug.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  CustomDateAdapter,
  MY_FORMATS
} from "../../../../shared/external/angular-material/datepicker/custom-date-adapter";
import {AuthService} from "../../../../shared/services/default/auth.service";

@Component({
  selector: 'app-courses-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatMomentDateModule, FormularioDebugComponent, MatDividerModule],
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class CoursesFormComponent implements OnInit {

  form: FormGroup = this.fb.group({
    courses: this.fb.array([])
  })

  @Input() courses: Course[] = [];

  maxEndDate = new Date();

  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private authService: AuthService,
              private _adapter: DateAdapter<any>,
              private _intl: MatDatepickerIntl,
              @Inject(MAT_DATE_LOCALE) private _locale: string,) {
    this.setDatePickerLocale();
  }

  setDatePickerLocale() {
    const defaultLanguage = this.authService.getDefaultLanguage();
    if (defaultLanguage === 'en') {
      this._locale = 'en-US';
      this._adapter.setLocale(this._locale);
    } else if (defaultLanguage === 'pt') {
      this._locale = 'pt-BR';
      this._adapter.setLocale(this._locale);
    }
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
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl>this.coursesFormArray.controls[index].get(formControlName), fieldName);
  }

  onAddNewCourse(alertEl?: HTMLDivElement) {
    if (alertEl) alertEl.hidden = true;
    this.addCourse();
  }

  onDatePickerOpen(picker: MatDatepicker<any>) {
    picker.open();
  }
}
