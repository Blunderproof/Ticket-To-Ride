import { Component, OnInit, Output } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { TrainCardComponent } from '../train-card/train-card.component';
import { TrainCard } from '../classes/train-card';
import { DestinationCard } from '../classes/destination-card';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  constructor(public _userInfo: UserInfo, private communicator: ServerProxy) { }

  ngOnInit() {}

  chooseTrainCard(trainCard: number) {
    console.log(`Choosing card ${trainCard}`);
    this.communicator.chooseTrainCard(trainCard);

    // window.setTimeout(() => {
    //   this.communicator.chooseTrainCard(trainCard);
    // }, 1500);
  }

  drawDestinationCards() {
    this.communicator.setChooseDestinationCardState().then((x: any) => {
      if (x.success) {
        this._userInfo.getUser();
      }
    });
  }

  destCardDeckValid(){
    let userInfo = this._userInfo;
    if(userInfo.isCurrentTurn()){
      if(userInfo.user.turnState != "OneTrainCardChosen"){
        if(userInfo.game.destinationCardDeck.length != 0){
          return true;
        }
      }
    }
    return false;
  }
}
