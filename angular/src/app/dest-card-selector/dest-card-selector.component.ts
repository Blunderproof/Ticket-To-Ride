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
  errorMessages = [];
  notSelected = [];
  selected = [];
  cards = [];

  constructor(public _userInfo: UserInfo, private _serverProxy: ServerProxy) {}

  ngOnInit() {
    console.log(`notSelected.length: ${this.notSelected.length}`);
    console.log(`selected.length: ${this.selected.length}`);
    this.updateSelectedCards();
  }

  chooseInitialDestinationCard() {
    this.updateSelectedCards();

    this._serverProxy.initialSelectDestinationCard(this.notSelected).then((x: any) => {
      if (x.success) {
        this._userInfo.getUser();
        this._userInfo.getGame();
        this.display = false;
      } else {
        this.errorMessages.push(x.message);
      }
    });
  }

  openModal() {
    this.display = true;
  }

  chooseDestinationCard() {
    this.updateSelectedCards();

    this._serverProxy.chooseDestinationCard(this.selected).then((x: any) => {
      if (x.success) {
        this._userInfo.getUser();
        this._userInfo.getGame();
        this.display = false;
      } else {
        this.errorMessages.push(x.message);
      }
    });
  }

  updateSelectedCards() {
    console.log("Selected/NotSelected Updated");
    if (this._userInfo.game && this._userInfo.game.turnNumber < 0) {
      this.notSelected = [];
      this.cards = this._userInfo.user.destinationCardHand;
      for (let i = 0; i < this.cards.length; i++) {
        if (!this.cards[i].selected) {
          this.notSelected.push(this.cards[i]._id);
        }
      }
    } else if (this._userInfo.game && this._userInfo.game.turnNumber >= 0) {
      this.selected = [];
      this.cards = this._userInfo.game.destinationCardDeck.slice(0, 3);
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].selected) {
          this.selected.push(this.cards[i]._id);
        }
      }
    }
  }
}
