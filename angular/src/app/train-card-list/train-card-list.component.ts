import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-train-card-list',
  templateUrl: './train-card-list.component.html',
  styleUrls: ['./train-card-list.component.scss']
})
export class TrainCardListComponent implements OnInit {
  cardOrder: string[];
  trainCounts: any[];
  info: UserInfo;

  constructor(public _userInfo: UserInfo) {
    this.cardOrder = ['pink', 'black', 'white', 'green', 'blue', 'red', 'yellow', 'orange', 'rainbow'];
   }

  ngOnInit() {
  }

}
