import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  constructor(public _userInfo: UserInfo) { }

  ngOnInit() {
  }

}
