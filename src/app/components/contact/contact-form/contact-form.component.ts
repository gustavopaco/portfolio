import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormValidator} from "../../../shared/validator/form-validator";
import {TranslateService} from "@ngx-translate/core";
import {FormularioDebugComponent} from "../../../shared/components/formulario-debug/formulario-debug.component";
import {ContactService} from "../../../shared/services/contact.service";
import {finalize, take} from "rxjs";
import {MatSnackbarService} from "../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {HttpValidator} from "../../../shared/validator/http-validator";
import {ACTION_CLOSE} from "../../../shared/constants/constants";

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, FormularioDebugComponent],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  isFormSubmitted = false;

  constructor(private fb: FormBuilder,
              private contactService: ContactService,
              private matSnackBarService: MatSnackbarService,
              private translateService: TranslateService) {
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.form.valid) {
      this.sendEmail();
    }
  }

  private sendEmail() {
    this.contactService.sendEmail(this.form.value)
      .pipe(
        take(1),
        finalize(() => this.isFormSubmitted = false)
      )
      .subscribe({
        next: () => {
          this.matSnackBarService.success(this.translateService.instant('contact-form_mailSent'), ACTION_CLOSE, 5000);
          this.form.reset();
        },
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000)
      })
  }

  matErrorMessage(formControlName: string, fieldName: string) {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translateService, <FormControl> this.form.get(formControlName), fieldName);
  }
}
