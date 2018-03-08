import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';
import { UserInfo } from '../services/user_info.service';


@Component({
  selector: 'app-opponent-card',
  templateUrl: './opponent-card.component.html',
  styleUrls: ['./opponent-card.component.scss']
})
export class OpponentCardComponent implements OnInit {
  @Input() index: number;

  constructor(public _userInfo: UserInfo) { }

  ngOnInit() {
    console.log('Created Opponent Card');
  }

  setColor() {

  }

}
