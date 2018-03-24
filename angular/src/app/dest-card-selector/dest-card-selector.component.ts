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

  chooseInitialDestinationCard() {
    const notSelected = [];
    const cards = this._userInfo.user.destinationCardHand;
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].selected) {
        notSelected.push(cards[i]._id);
      }
    }

    if (notSelected.length <= 1) {
      this.display = false;
      // TODO: Use promise (.then) and display the server error instead of the one we have hard-coded in the else
      this._serverProxy.initialSelectDestinationCard(notSelected).then((x: any) => {
        if (x.success) {
          this._userInfo.getUser();
          this._userInfo.getGame();
        }
      });
    } else {
      this.message = 'Make sure you choose 2 or 3 destination cards to keep.';
    }
  }

  openModal() {
    this.display = true;
  }

  chooseDestinationCard() {
    const selected = [];
    const cards = this._userInfo.game.destinationCardDeck.slice(0, 3);
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].selected) {
        selected.push(cards[i]._id);
      }
    }

    if (selected.length > 0) {
      this.display = false;

      // TODO: Use promise (.then) and display the server error instead of the one we have hard-coded in the else
      this._serverProxy.chooseDestinationCard(selected).then((x: any) => {
        if (x.success) {
          this._userInfo.getUser();
          this._userInfo.getGame();
        }
      });
    } else {
      this.message = 'Make sure you choose at least 1 destination card to keep.';
    }
  }

  ngOnInit() {
    console.log(this._userInfo);
  }
}
