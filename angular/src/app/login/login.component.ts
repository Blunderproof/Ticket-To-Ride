import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { createFormGroup } from '../core/utils/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  controls = {
    username: this._fb.control('', Validators.required)
  };

  form = createFormGroup(this.controls);

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
  }

}
