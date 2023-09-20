import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Subscription} from "rxjs";

export class FormValidator {
  static validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        if (control.invalid) {
          control.markAsDirty({onlySelf: true});
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }

  static validateRulesIsInvalidAndFormSubmitted(formSubmitted: boolean, formControl: FormControl): boolean {
    return (formSubmitted && formControl.invalid);
  }

  static validateRulesIsInvalidAndDirtyOrIsInvalidAndFormSubmitted(formSubmitted: boolean, formControl: FormControl): boolean {
    return (formControl.dirty && formControl.invalid || formSubmitted && formControl.invalid);
  }

  private static validateRulesIsInvalidAndDirty(formControl: FormControl): boolean {
    return (formControl.dirty && formControl.invalid)
  }

  static validateLabelNgClass(formSubmitted: boolean, formControl: FormControl): string {
    if (formControl.valid) {
      return 'valid-feedback'
    }
    if (this.validateRulesIsInvalidAndDirtyOrIsInvalidAndFormSubmitted(formSubmitted, formControl)) {
      return 'invalid-feedback'
    }
    return '';
  }

  static validateLabelInterpolation(formSubmitted: boolean, formControl: FormControl, fieldName: string) {
    return this.validateRulesIsInvalidAndDirtyOrIsInvalidAndFormSubmitted(formSubmitted, formControl) ? `*${fieldName} obrigatório.` : fieldName
  }

  static validateInputNgClass(formSubmitted: boolean, formControl: FormControl): string {
    if (formControl.valid) {
      return 'is-valid'
    }
    if (this.validateRulesIsInvalidAndDirtyOrIsInvalidAndFormSubmitted(formSubmitted, formControl)) {
      return 'is-invalid'
    }
    return '';
  }

  static validateInputNgClassPending(formSubmitted: boolean, formControl: FormControl): string {
    if (formControl.valid) {
      return 'is-valid'
    }
    if (this.validateRulesIsInvalidAndDirtyOrIsInvalidAndFormSubmitted(formSubmitted, formControl) || formControl.pending) {
      return 'is-invalid'
    }
    return '';
  }

  static validateInputPasswordEqualsTo = (formulario: FormGroup): Subscription => {
    return formulario.get('password')!.valueChanges.subscribe(() => {
      if (formulario.get('password')?.valid) {
        FormValidator.validateInputEqualsTo(formulario);
      }
    });
  }

  static validateInputConfirmPasswordEqualsTo(formulario: FormGroup): Subscription {
    return formulario.get('confirmPassword')!.valueChanges.subscribe(() => {
      FormValidator.validateInputEqualsTo(formulario);
    });
  }

  private static validateInputEqualsTo(formulario: FormGroup) {
    if (formulario.get('confirmPassword')?.dirty && formulario.get('password')?.value !== formulario.get('confirmPassword')?.value) {
      formulario.get('confirmPassword')?.setErrors({equalsTo: true})
    } else if (formulario.get('confirmPassword')?.dirty && formulario.get('password')?.value === formulario.get('confirmPassword')?.value) {
      formulario.get('confirmPassword')?.setErrors(null)
    }
  }

  static validateSmallNgClass(formControl: FormControl): string {
    return formControl.valid ? 'valid-feedback' : 'invalid-feedback'
  }

  static validateSmallBasicInterpolation(formSubmitted: boolean, formControl: FormControl): string {
    if (formControl.valid) {
      return 'Válido';
    }
    if (this.validateRulesIsInvalidAndDirtyOrIsInvalidAndFormSubmitted(formSubmitted, formControl)) {
      return '*Campo obrigatório';
    }
    return 'Campo inválido';
  }

  static validateSmallBasicInterpolationEmailOrEmailInUsePending(formControl: FormControl, defaultMessage: string): string {
    if (formControl.status == 'PENDING') {
      return 'Verificando';
    }
    if (formControl.hasError('email')) {
      return 'E-mail inválido';
    }
    if (formControl.hasError('emailInUse')) {
      return 'E-mail já existe';
    }
    if (formControl.valid) {
      return 'E-mail válido';
    }
    return defaultMessage;
  }

  static validateSmallGenericInterpolation(formControl: FormControl, fieldName: string, fieldNameEqualsTo?: string): string {
    if (formControl?.errors) {
      const errorMessages: Record<string, string> = {
        required: `*${fieldName} obrigatório.`,
        mask: `*${fieldName} inválido.`,
        minlength: `*Mínimo de ${formControl.errors['minlength']?.requiredLength} caracteres.`,
        maxlength: `*Máximo de ${formControl.errors['maxlength']?.requiredLength} caracteres.`,
        email: `*E-mail inválido.`,
        emailInUse: `*E-mail já existe.`,
        cepInvalido: `*CEP inválido.`,
        bsDate: `*Formato de data inválido.`,
        equalsTo: `*${fieldName} e ${fieldNameEqualsTo}, devem ser iguais.`,
        min: `*${fieldName} deve ser maior ou igual a ${formControl.errors['min']?.min}.`,
        max: `*${fieldName} deve ser menor ou igual a ${formControl.errors['max']?.max}.`,
      }
      return this.loopIntoSmallInterpolationInputErrors(formControl, fieldName, errorMessages)
    }
    return `${fieldName} válido`;
  }

  private static loopIntoSmallInterpolationInputErrors(formControl: FormControl, fieldName: string, errorMessages: Record<string, string>): string {
    if (formControl?.errors) {
      for (let errorsKey in formControl.errors) {
        if (formControl.errors.hasOwnProperty(errorsKey) && errorMessages.hasOwnProperty(errorsKey)) {
          return errorMessages[errorsKey]
        }
      }
    }
    return `${fieldName}`
  }

  static validaFormArrayRulesSuperIsRequired(formSubmitted: boolean, formArray: FormArray): boolean {
    return formArray.touched && formArray.invalid && formArray.hasError('required') || formSubmitted && formArray.invalid && formArray.hasError('required');
  }

  static validateFormArraySuperNgClass(formSubmitted: boolean, formArray: FormArray): string {
    return (formArray.dirty && formArray.invalid || formSubmitted && formArray.invalid) ? 'is-invalid' : '';
  }

  static validateFormArrayInputNgClass(formControlName: string, formSubmitted: boolean, itemFormArray: AbstractControl): string {
    return this.validateInputNgClass(formSubmitted, (<FormControl>itemFormArray.get(formControlName)));
  }

  static validateFormArrayInputNgClass2(formControlName: string, formSubmitted: boolean, formArray: FormArray, index: number): string {
    // let inputFormControl = formulario.get(formArrayName)?.get(String(index))?.get(input) as FormControl;
    let inputFormControl = formArray.get(String(index))?.get(formControlName) as FormControl
    return this.validateInputNgClass(formSubmitted, inputFormControl);
  }

  static validateFormArraySmallGenericInterpolation(formControlName: string, fieldName: string, itemFormArray: AbstractControl, fieldNameEqualsTo?: string): string {
    return this.validateSmallGenericInterpolation(<FormControl>itemFormArray.get(formControlName), fieldName, fieldNameEqualsTo)
  }

  static validateFormBuilderControlCustomEmail(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const email: string = formControl.value;

      if (email && (email.includes('.com') || email.includes('.com.br'))) {
        return null; // O e-mail é válido
      } else {
        return {email: true}; // O e-mail é inválido
      }
    };
  }

  /*Note: Metodo para FormArray de Booleans, usado na parte de Validators na criacao do formulario.array
  *  Nesse metodo estamos usando o itemArray.value como comparacao pq la dentro so tem true ou false por que é um Array de Boolean
  *  com isso podemos contar quantos valores sao true, e
  *  se a quantidade de valores TRUE for >= 1, que é o minimo setado na assinatura do metodo, entao esta valido
  *  senao colocamos o setamos o erro {required: true}*/
  static validateFormBuilderFormArrayMinCheckBox(minValid = 1) {
    return function (formArray: AbstractControl) {
      if (formArray instanceof FormArray) {
        // const totalChecked = formArray.controls
        //   .map(item => item.value)
        //   .reduce((total:any, current: any) => current ? total + current : total, 0)
        let totalChecked = 0;
        formArray.controls.forEach(itemArray => {
          if (itemArray.value) {
            totalChecked++;
          }
        })
        return totalChecked >= minValid ? null : {required: true}
      }
      throw new Error('formArray is not an instance of FormArray')
    }
  }

  static validateFormBuilderControlCep(formControl: FormControl) {
    if (formControl.value != undefined && formControl.value != "") {
      const validacep = /^\d{5}-\d{3}$/;
      const validacep2 = /^\d{8}$/;
      return (validacep.test(formControl.value) || validacep2.test(formControl.value)) ? null : {cepInvalido: true}
    }
    return null;
  }

  static validateFormBuilderControlEqualsTo(otherFormControlName: string) {
    return function (formControl: FormControl) {
      if (otherFormControlName == null) {
        throw new Error("É necessário informar um campo para comparação do formBuilderValidateEqualsTo")
      }
      const input = (formControl.root as FormGroup).get(otherFormControlName)

      if (input instanceof FormControl && !input) {
        throw new Error("Input informado como parâmetro otherInput do método formBuilderValidateEqualsTo não existe")
      }
      if (input instanceof FormControl) {
        return input.value == formControl.value ? null : {equalsTo: true}
      }
      return null
    }
  }

  // Note: Esta comentado porque VerificaEmailService nao existe. Para nao dar erro
  // static validateFormBuilderAsyncEmail(verificaEmailService: VerificaEmailService): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors> => {
  //     return verificaEmailService.asyncValidateMail(control.value)
  //       .pipe(
  //         map((emailExiste: boolean) => emailExiste ? {emailInUse: true} : {})
  //       );
  //   }
  // }

  static validateFormBuilderControlPasswordRegex(formControl: AbstractControl) {
    const password = formControl.value;
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~<>,.?/[\]{}|])[A-Za-z\d!@#$%^&*()_+~<>?,.:;"{}\\[\]/|]{8,}/;

    return validPassword.test(password) ? null : {passwordInvalid: true}
  }
}
