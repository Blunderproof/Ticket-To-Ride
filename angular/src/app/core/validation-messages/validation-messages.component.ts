import { Component, Input } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { CustomValidatorsService } from '../custom-validators.service';

@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss']
})
export class ValidationMessagesComponent {
  @Input() control: AbstractControl;

  constructor(private _customValidators: CustomValidatorsService) { }

  errorMessage() {
      if (this.control.errors != null) {
          if (this.control instanceof FormGroup || this.control instanceof FormArray) {
              // make sure all controls in controlgroup/controlarray have been touched before giving error message.
              if (Object.keys((<FormGroup>this.control).controls).map(x => (<FormGroup>this.control).controls[x]).every(x => x.touched)) {
                  for (const prop of Object.getOwnPropertyNames(this.control.errors)) {
                      return this._customValidators.getValidatorErrorMessage(prop, this.control.errors[prop]);
                  }
              }
          } else {
              if (this.control.touched) {
                  for (const prop of Object.getOwnPropertyNames(this.control.errors)) {
                      return this._customValidators.getValidatorErrorMessage(prop, this.control.errors[prop]);
                  }
              }
          }
      }
  }
}
