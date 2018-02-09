import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { createFormGroup } from '../core/utils/forms';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  registering = false;

  login_controls = {
    username: this._fb.control('', Validators.required),
    password: this._fb.control('', Validators.required)
  };

  register_controls = {
    username: this._fb.control('', Validators.required),
    password: this._fb.control('', Validators.required),
    confirmPassword: this._fb.control('', Validators.required)
  };
  form = createFormGroup(this.login_controls);

  constructor(private _fb: FormBuilder, private _serverProxy: ServerProxy) { }

  ngOnInit() {  }

  setRegistering(value: boolean) {
    this.registering = value;
    if (this.registering) {
      this.form = createFormGroup(this.register_controls);
    } else {
      this.form = createFormGroup(this.login_controls);
    }
  }

  onSubmit() {
    if (!this.registering) {
      // alert(`Username: ${this.login_controls.username.value}, Password: ${this.login_controls.password.value}`);
      console.log('Logging in');
      this._serverProxy.login(this.login_controls.username.value, this.login_controls.password.value);
    } else {
      /* alert(`Username: ${this.register_controls.username.value}, Password: ${this.register_controls.password.value},
      Confirm: ${this.register_controls.confirmPassword.value}`);*/
      console.log('Registering');
      // tslint:disable-next-line:max-line-length
      this._serverProxy.register(this.register_controls.username.value, this.register_controls.password.value, this.register_controls.confirmPassword.value);
    }
  }
}
