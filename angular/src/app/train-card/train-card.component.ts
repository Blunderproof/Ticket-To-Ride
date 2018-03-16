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

  ngOnInit() {
  }

  isCurrentTurn(){
    if (this._userInfo.user.userIndex == (this._userInfo.game.turnNumber % this._userInfo.game.userList.length)){
      return true;
    } else{
      return false;
    }
  }
  trainCardClicked(){
    this.clicked = true;
    window.setTimeout(() => {this.clicked = false}, 1000)
  }


  isClicked(){
    return this.clicked;
  }

}
