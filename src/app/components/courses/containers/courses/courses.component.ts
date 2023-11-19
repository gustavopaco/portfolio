import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../../../shared/services/user.service";
import {HttpParams} from "@angular/common/http";
import {AuthService} from "../../../../shared/services/default/auth.service";
import {Course} from "../../../../shared/interface/course";
import {delay, finalize, take} from "rxjs";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CoursesFormComponent} from "../courses-form/courses-form.component";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, TranslateModule, MatButtonModule, MatIconModule, CoursesFormComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];

  isLoadingCourses = true;
  isErrorOnLoadingCourses = false;

  constructor(private userService: UserService,
              private authService: AuthService,
              private matSnackBarService: MatSnackbarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.getCourseRecords();
  }

  paramsToRequest() {
    return new HttpParams().set('nickname', this.authService.getNickname())
  }

  getCourseRecords() {
    this.userService.getCourseRecords(this.paramsToRequest())
      .pipe(
        take(1),
        delay(3000),
        finalize(() => this.isLoadingCourses = false)
      )
      .subscribe({
        next: (courses) => {
          this.courses = courses;
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_close'));
          this.isErrorOnLoadingCourses = true;
        }
      })
  }
}
