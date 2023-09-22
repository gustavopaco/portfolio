import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiService} from "../../shared/services/ui.service";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {FormValidator} from "../../shared/validator/form-validator";
import {AuthService} from "../../shared/services/auth.service";
import {take} from "rxjs";
import {FormularioDebugComponent} from "../../shared/components/formulario-debug/formulario-debug.component";
import {AUTHORIZATION_HEADER} from "../../shared/constants/constants";
import {MatSnakebarService} from "../../shared/external/angular-material/toast-snackbar/mat-snakebar.service";
import {HttpValidator} from "../../shared/validator/http-validator";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, FormularioDebugComponent],
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
              private matSnakeBarService: MatSnakebarService,
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
          next: (response: any) => {
            this.authService.saveToken(response.headers.get(AUTHORIZATION_HEADER));
            this.router.navigate(['/profile'])
          },
          error: (error: any) => this.matSnakeBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed to authenticate', 5000, 'center', 'top')
        })
    }
  }

  validatorMessages(formControlName: string, validatorName: string): string {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translate, <FormControl>this.form.get(formControlName), validatorName);
  }
}
