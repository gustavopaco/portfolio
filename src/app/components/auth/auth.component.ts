import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiService} from "../../shared/services/default/ui.service";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormValidator} from "../../shared/validator/form-validator";
import {AuthService} from "../../shared/services/default/auth.service";
import {take} from "rxjs";
import {FormularioDebugComponent} from "../../shared/components/formulario-debug/formulario-debug.component";
import {AUTHORIZATION_HEADER} from "../../shared/constants/constants";
import {MatSnackbarService} from "../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../shared/validator/http-validator";
import {Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, FormularioDebugComponent, TranslateModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  })

  constructor(private uiService: UiService,
              private fb: FormBuilder,
              private translate: TranslateService,
              private authService: AuthService,
              private matSnakeBarService: MatSnackbarService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadUiConfiguration();
  }

  private loadUiConfiguration() {
    setTimeout(() => {
      this.uiService.showNavBar(false);
      this.uiService.showFooter(false);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.authenticate(this.form.value)
        .pipe(take(1))
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.authService.saveToken(response.headers.get(AUTHORIZATION_HEADER)!);
            this.authService.saveNickname(response.body.nickname);
            this.router.navigate(['/profile'])
          },
          error: (error: any) => this.matSnakeBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translate.instant('auth.message.error'), 5000, 'center', 'top')
        })
    }
  }

  validatorMessages(formControlName: string, validatorName: string): string {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translate, <FormControl>this.form.get(formControlName), validatorName);
  }
}
