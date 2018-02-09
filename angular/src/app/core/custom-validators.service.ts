import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Subscriber } from 'rxjs/Subscriber';
import { of } from 'rxjs/observable/of';
import { tap, debounceTime, distinctUntilChanged, switchMap, map, catchError, share, first } from 'rxjs/operators';

// required validator built in
interface RequiredValidationResult {
  required: boolean | Function;
}

// requiredTrue validator built in
interface RequiredTrueValidationResult {
  required: boolean | Function;
}

interface PasswordsEqualValidationResult {
  passwordsequal: boolean | Function;
}

interface GroupEqualValidationResult {
  groupequal: boolean | Function;
}

interface PatternValidationResult {
  pattern: Pattern | Function;
}

// wrap built in pattern validator with validator that can take a custom message
interface Pattern {
  requiredPattern: any;
  actualValue: any;
  customMessage: any;
}

interface MaxLengthValidationResult {
  maxlength: MaxLength | Function;
}

// maxlength validator built in
interface MaxLength {
  requiredLength: any;
  actualLength: any;
}

interface MaxValidationResult {
  max: Max | Function;
}

// max validator built in
interface Max {
  max: any;
  actual: any;
}

interface MinLengthValidationResult {
  minlength: MinLength | Function;
}

// minlength validator built in
interface MinLength {
  requiredLength: any;
  actualLength: any;
}

interface MinValidationResult {
  min: Min | Function;
}

// min validator built in
interface Min {
  min: any;
  actual: any;
}

interface EqualsValidationResult {
  equals: Equals | Function;
}

interface Equals {
  requiredValue: any;
  actualValue: any;
}

interface ValidationResult extends RequiredValidationResult, MaxLengthValidationResult,
  MinLengthValidationResult, PasswordsEqualValidationResult, GroupEqualValidationResult,
  MaxValidationResult, MinValidationResult, PatternValidationResult, EqualsValidationResult {
}

@Injectable()
export class CustomValidatorsService {
  constructor() { }

  messages: ValidationResult = {
    required: () => 'This field is required.',
    maxlength: (value: MaxLength) => `Please enter no more than ${value.requiredLength} characters.`,
    minlength: (value: MinLength) => `Please enter at least ${value.requiredLength} characters.`,
    equals: (value: Equals) => `Please enter '${value.requiredValue}'.`,
    passwordsequal: () => 'Passwords must match.',
    groupequal: () => 'Fields must match.',
    max: (value: Max) => `Please enter a value less than or equal to ${value.max}.`,
    min: (value: Min) => `Please enter a value greater than or equal to ${value.min}.`,
    pattern: (value: Pattern) => value.customMessage != null ?
      value.customMessage :
      `Please enter a value that matches regex pattern ${value.requiredPattern}.`
  };

  getValidatorErrorMessage(validationResultKey: string, validationResultValue: any) {
    return this.messages[validationResultKey](validationResultValue);
  }

  equalsValidator(other): ValidatorFn {
    return (control: FormControl): EqualsValidationResult => {
      if (Validators.required(control) != null) {
        return null;
      }

      if (!(control.value === other)) {
        return { equals: { requiredValue: other, actualValue: control.value } };
      }
    };
  }

  // wrap built in pattern validator with validator that can take a custom message
  patternValidator(pattern: string | RegExp, customMessage?: string): ValidatorFn {
    const builtInPatternValidator = Validators.pattern(pattern);

    return (control: FormControl): PatternValidationResult => {
      const result = <PatternValidationResult>builtInPatternValidator(control);
      if (result != null) {
        // add customMessage
        (<Pattern>result.pattern).customMessage = customMessage;
        return result;
      }
    };
  }

  passwordsEqualValidator = (controlGroup: FormGroup): PasswordsEqualValidationResult => {
    if (this.groupEqualValidator(controlGroup)) {
      return { passwordsequal: true };
    }
  }

  groupEqualValidator = (controlGroup: FormGroup): GroupEqualValidationResult => {
    const controls = Object.keys(controlGroup.controls).map(x => controlGroup.controls[x])
      .filter(x => x.touched || x.dirty || !!x.value); // or value is truthy
    if (!controls.every(x => x.value.toString().trim() === controls[0].value.toString().trim())) {
      return { groupequal: true };
    }
  }
}
