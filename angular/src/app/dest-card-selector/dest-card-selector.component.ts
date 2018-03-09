import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-dest-card-selector',
  templateUrl: './dest-card-selector.component.html',
  styleUrls: ['./dest-card-selector.component.scss'],
})
export class DestCardSelectorComponent implements OnInit {
  display = true;
  message = null;

  constructor(public _userInfo: UserInfo, private _serverProxy: ServerProxy) {}

  onCloseHandled() {
    let notSelected = [];
    let cards = this._userInfo.user.destinationCardHand;
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].selected) notSelected.push(cards[i]._id);
    }

    if (notSelected.length <= 1) {
      this.display = false;
      this._serverProxy.initialSelectDestinationCard(notSelected);
    } else {
      this.message = 'Make sure you choose 2 or 3 destination cards to keep.';
    }
  }

  openModal() {
    this.display = true;
  }

  ngOnInit() {
    console.log(this._userInfo);
  }
}
