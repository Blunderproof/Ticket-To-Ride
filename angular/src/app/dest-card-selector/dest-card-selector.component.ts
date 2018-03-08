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


  constructor( public _userInfo: UserInfo, private _serverProxy: ServerProxy) {}

  onCloseHandled() {
    this.display = false;
    let notSelected = [];
    let cards = this._userInfo.user.destinationCardHand
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].selected) notSelected.push(cards[i]._id)
    }
    this._serverProxy.initialSelectDestinationCard(notSelected);
  }

  openModal() {
    this.display = true;
  }

  ngOnInit() {
    console.log(this._userInfo)
  }
}
