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

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  })

  constructor(private uiService: UiService,
              private fb: FormBuilder,
              private translate: TranslateService) {
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
      console.log(this.form.value)
    }
  }

  validatorMessages(formControlName: string, validatorName: string): string {
    return FormValidator.validateSmallI18nGenericInterpolation(this.translate, <FormControl>this.form.get(formControlName), validatorName);
  }
}
