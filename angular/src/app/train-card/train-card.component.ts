import { Component, OnInit, Input } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { TrainCard } from '../classes/train-card';

@Component({
  selector: 'app-train-card',
  templateUrl: './train-card.component.html',
  styleUrls: ['./train-card.component.scss']
})
export class TrainCardComponent implements OnInit {
  @Input() trainCard: TrainCard;

  constructor(public _userInfo: UserInfo, private communicator: ServerProxy) { }

  clicked = false;

  ngOnInit() {}

  trainCardClicked() {
    this.clicked = true;
    window.setTimeout(() => {
      this.clicked = false;
    }, 1000);
  }

  trainCardValid(trainCardColor: string){
    let userInfo = this._userInfo;
    if(userInfo.isCurrentTurn()){
      if(trainCardColor === "rainbow"){
        if(userInfo.user.turnState != "OneTrainCardChosen"){
          return true;
        }
      }
      else{
        return true;
      }
    }
    return false;
  }

  isClicked() {
    return this.clicked;
  }
}
