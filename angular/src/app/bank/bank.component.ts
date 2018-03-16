import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { TrainCardComponent } from '../train-card/train-card.component';
import { TrainCard } from '../classes/train-card';
import { DestinationCard } from '../classes/destination-card';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  constructor(public _userInfo: UserInfo, private communicator: ServerProxy) { }


  ngOnInit() {
  }

  isCurrentTurn(){
    if (this._userInfo.user.userIndex == (this._userInfo.game.turnNumber % this._userInfo.game.userList.length)){
      return true;
    } else{
      return false;
    }
  }

  chooseTrainCard(trainCard: TrainCard) {
    window.setTimeout(() => {this.communicator.chooseTrainCard(trainCard)}, 1500)

    //this.communicator.chooseTrainCard(trainCard);
  }


  chooseDestinationCard(destinationCard: DestinationCard) {
    this.communicator.chooseDestinationCard(destinationCard);
  }
}
