import { Component } from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  codeError = 404;

  constructor(private activatedRoute: ActivatedRoute,
              private translateService: TranslateService,
              private location: Location) {
    this.activatedRoute.url
      .pipe(takeUntilDestroyed())
      .subscribe(url => {
        if (url[0].path === 'error') {
          this.codeError = 500;
        }
      });
  }

  setCodeName() {
    switch (this.codeError) {
      case 404:
        return this.translateService.instant('error_component.404_code_name');
      case 500:
        return this.translateService.instant('error_component.500_code_name');
      default:
        return this.translateService.instant('error_component.default_code_name');
    }
  }

  setCodeDescription() {
    switch (this.codeError) {
      case 404:
        return this.translateService.instant('error_component.404_code_description');
      case 500:
        return this.translateService.instant('error_component.500_code_description');
      default:
        return this.translateService.instant('error_component.default_code_description');
    }
  }

  navigateBack() {
    this.location.back();
  }
}
