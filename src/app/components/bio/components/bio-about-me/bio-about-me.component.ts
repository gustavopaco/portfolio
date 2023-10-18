import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Bio} from "../../../../shared/interface/bio";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStepperModule, StepperOrientation} from "@angular/material/stepper";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {FormularioDebugComponent} from "../../../../shared/components/formulario-debug/formulario-debug.component";
import {MatIconModule} from "@angular/material/icon";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map, Observable} from "rxjs";
import {BIO_READY_TO_BE_SAVED, FILL_ALL_FIELDS} from "../../../../shared/constants/constants";

@Component({
  selector: 'app-bio-about-me',
  standalone: true,
  imports: [CommonModule, MatStepperModule, ReactiveFormsModule, MatInputModule, MatButtonModule, FormularioDebugComponent, MatIconModule],
  templateUrl: './bio-about-me.component.html',
  styleUrls: ['./bio-about-me.component.scss'],
  providers: [
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
  ]
})
export class BioAboutMeComponent implements OnInit {

  @Input() requestLoading = false;
  @Input() bio?: Bio;
  @Output() changedAboutMe = new EventEmitter<Bio>();

  formPresentation = this.fb.group({
    presentation: ['', [Validators.required, Validators.maxLength(500)]],
  });

  formTestimonial = this.fb.group({
    testimonial: ['', [Validators.required, Validators.maxLength(500)]]
  });

  isLinear = false;

  stepperOrientation: Observable<StepperOrientation>

  constructor(private fb: FormBuilder,
              private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'))
  }

  ngOnInit(): void {
    this.loadBioOnForm();
  }

  private loadBioOnForm() {
    this.formPresentation.patchValue({
      presentation: this.bio?.presentation
    });
    this.formTestimonial.patchValue({
      testimonial: this.bio?.testimonial
    });
  }

  setDoneMessage() {
    if (this.isFormsValid()) {
      return BIO_READY_TO_BE_SAVED;
    }
    return FILL_ALL_FIELDS;
  }

  isFormsValid() {
    return this.formPresentation.valid && this.formTestimonial.valid;
  }

  onSubmit() {
    if (this.formValuesChangesFromBio() && !this.requestLoading) {
      this.changedAboutMe.emit({
        ...this.bio!,
        presentation: this.formPresentation.value.presentation!,
        testimonial: this.formTestimonial.value.testimonial!
      });
    }
  }

  private formValuesChangesFromBio() {
    return this.formPresentation.value.presentation !== this.bio?.presentation
      || this.formTestimonial.value.testimonial !== this.bio?.testimonial;
  }
}
