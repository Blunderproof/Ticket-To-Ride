import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { DestinationCard } from '../classes/destination-card';

@Component({
  selector: 'app-dest-card-viewer',
  templateUrl: './dest-card-viewer.component.html',
  styleUrls: ['./dest-card-viewer.component.scss'],
})
export class DestCardViewerComponent implements OnInit {
  constructor(public _userInfo: UserInfo) {}

  ngOnInit() {
    console.log(this._userInfo, 'USERINFO');
  }

  is_complete(card: DestinationCard) {
    const metCards = this._userInfo.user.metDestinationCards;
    for (let i = 0; i < metCards.length; i++) {
      if ((metCards[i] as any)._id == card._id) {
        return true;
      }
    }
    return false;
  }
}
