import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { createFormGroup } from '../core/utils/forms';
import { ServerProxy } from '../services/server_proxy.service';
import { Router } from '@angular/router';
import { CustomValidatorsService } from '../core/custom-validators.service';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessages = [];
  registering = false;

  login_controls = {
    username: this._fb.control('', Validators.required),
    password: this._fb.control('', Validators.required)
  };

  password = this._fb.control('', Validators.required);
  register_controls = {
    username: this._fb.control('', Validators.required),
    password: this.password,
    confirmPassword: this._fb.control('', [Validators.required, this._customValidators.passwordsEqualValidator(this.password)])
  };
  form = createFormGroup(this.login_controls);

  // tslint:disable-next-line:max-line-length
  constructor(private _fb: FormBuilder, private _serverProxy: ServerProxy, private _router: Router, private _customValidators: CustomValidatorsService, private userinfo: UserInfo) { }

  ngOnInit() { }

  setRegistering(value: boolean) {
    this.registering = value;
    if (this.registering) {
      this.form = createFormGroup(this.register_controls);
    } else {
      this.form = createFormGroup(this.login_controls);
    }
  }

  revalidate() {
    if (this.registering) {
      this.form.controls.confirmPassword.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.errorMessages = [];
    if (!this.registering) {
      this._serverProxy.login(this.login_controls.username.value, this.login_controls.password.value)
        .then((x: any) => {
          this.userinfo.user.id = x.result.userID;
          this.userinfo.user.username = x.result.username;
          if (x.success) {
            this._router.navigate(['/lobby']);
          } else {
            this.errorMessages.push(x.message);
          }
        });
    } else {
      // tslint:disable-next-line:max-line-length
      this._serverProxy.register(this.register_controls.username.value, this.register_controls.password.value, this.register_controls.confirmPassword.value)
        .then((x: any) => {
          if (x.success) {
            this.userinfo.user.id = x.result.userID;
            this.userinfo.user.username = x.result.username;
            this._router.navigate(['/lobby']);
          } else {
            this.errorMessages.push(x.message);
          }
        });
    }
  }
}
