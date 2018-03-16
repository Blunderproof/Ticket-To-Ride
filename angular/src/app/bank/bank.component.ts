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


  ngOnInit() {}

  chooseTrainCard(trainCard: TrainCard) {
    window.setTimeout(() => {
      this.communicator.chooseTrainCard(trainCard);
    }, 1500);
  }

  chooseDestinationCard(destinationCard: DestinationCard) {
    this.communicator.chooseDestinationCard(destinationCard);
  }
}
