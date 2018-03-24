import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';
import { RouteColor, TrainColor } from '../classes/constants';

@Component({
  selector: 'app-select-gray-color-modal',
  templateUrl: './select-gray-color-modal.component.html',
  styleUrls: ['./select-gray-color-modal.component.scss'],
})
export class SelectGrayColorModal implements OnInit {
  errorMessages = [];

  constructor(public _userInfo: UserInfo, private communicator: ServerProxy) {}

  ngOnInit() {}

  colorClicked(color) {
    let data = {
      city1: this._userInfo.routeSelected.city1,
      city2: this._userInfo.routeSelected.city2,
      color: this._userInfo.routeSelected.color,
      routeNumber: this._userInfo.routeSelected.routeNumber,
      colorToUse: TrainColor[color],
    };

    console.log(data);

    this.communicator.claimRoute(data).then((x: any) => {
      if (!x.success) {
        this.errorMessages.push(x.message);
      } else {
        this._userInfo.displayColorSelection = false;
        this._userInfo.routeSelected = null;
      }
    });
  }
}
