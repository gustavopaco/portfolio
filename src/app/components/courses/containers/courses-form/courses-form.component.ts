import {Component, Inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Course} from "../../../../shared/interface/course";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {MatCardModule} from "@angular/material/card";
import {finalize, take} from "rxjs";
import {UserService} from "../../../../shared/services/user.service";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-courses-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatMomentDateModule, FormularioDebugComponent, MatDividerModule, MatCardModule],
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

  isFormDisabled = false;

  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private userService: UserService,
              private authService: AuthService,
              private matSnackBarService: MatSnackbarService,
              private _adapter: DateAdapter<any>,
              private _intl: MatDatepickerIntl,
              @Inject(MAT_DATE_LOCALE) private _locale: string) {
    this.loadLanguageSubscription();
  }

  loadLanguageSubscription() {
    this.authService.defaultLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe((language: string) => {
        if (language === 'en') {
          this._locale = 'en-US';
          this._adapter.setLocale(this._locale);
        } else if (language === 'pt') {
          this._locale = 'pt-BR';
          this._adapter.setLocale(this._locale);
        }
      });
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
      name: [course?.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      issuer: [course?.issuer, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      endDate: new FormControl<Date | undefined>(course?.endDate, [Validators.required])
    })
    this.coursesFormArray.push(coursesFormGroup);
  }

  removeCourse(index: number) {
    const course = this.coursesFormArray.controls[index].value;
    if (course.id) {
      this.isFormDisabled = true;
      this.userService.deleteCourseRecord(course.id)
        .pipe(
          take(1),
          finalize(() => this.isFormDisabled = false)
        )
        .subscribe({
          next: () => {
            this.matSnackBarService.success(this.translateService.instant('courses_form.messages.success_delete'), this.translateService.instant('generic_messages.action_close'), 3000);
            this.coursesFormArray.removeAt(index);
          },
          error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error))
        })
    } else {
      this.coursesFormArray.removeAt(index);
    }
  }

  get coursesFormArray() {
    return this.form.get('courses') as FormArray;
  }

  onSubmit() {
    if (this.form.valid && !this.isFormDisabled) {
      this.saveCoursesRecords(this.coursesFormArray.value);
    }
  }

  private saveCoursesRecords(courses: Course[]) {
    this.isFormDisabled = true;
    this.userService.saveCoursesRecords(courses)
      .pipe(
        take(1),
        finalize(() => this.isFormDisabled = false)
      )
      .subscribe({
        next: () => {
          this.matSnackBarService.success(this.translateService.instant('courses_form.messages.success'), this.translateService.instant('generic_messages.action_close'), 3000);
        },
        error: (error: any) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error))
      })
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
