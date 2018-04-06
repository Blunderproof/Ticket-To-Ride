import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { Message } from '../classes/message';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  historyList = [];
  itemsToToast = [];

  constructor(
    public _userInfo: UserInfo,
    public _gameHistory: GameHistory,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private socket: SocketCommunicator
  ) {
    // Assign the selected theme name to the `theme` property of the instance of ToastyConfig.
    // Possible values: default, bootstrap, material
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = 'bottom-left';
  }

  ngOnInit() {
    this.sockets();
    this._userInfo.newMessage.subscribe(isError => {
      this.quickToast(isError);
    });
  }

  sockets() {
    this.socket.updateGameHistory((data: Array<Message>) => {
      if (data.length > this.historyList.length) {
        const newItemCount = data.length - this.historyList.length;
        this.historyList = data;
        this.itemsToToast = data.reverse().slice(this.historyList.length - newItemCount, this.historyList.length);
        this.addToast();
        this.historyList = data;
      }
    });
  }

  quickToast(isError: boolean) {
    const currToastyService = this.toastyService;
    if (this._userInfo.errorMessages.length != 0) {
      const toast: ToastOptions = {
        title: isError ? 'Uh oh' : 'Nice!',
        msg: this._userInfo.errorMessages[this._userInfo.errorMessages.length - 1],
        showClose: true,
        timeout: 5000,
        theme: 'bootstrap',
        // onAdd: (toast:ToastData) => {
        //     console.log('Toast ' + toast.id + ' has been added!');
        // },
        // onRemove: function(toast:ToastData) {
        //     console.log('Toast ' + toast.id + ' has been removed!');
        // }
      };
      if (isError) {
        currToastyService.error(toast);
      } else {
        currToastyService.success(toast);
      }
    }
  }

  addToast() {
    const currToastyService = this.toastyService;
    if (this.itemsToToast != null) {
      this.itemsToToast.forEach((historyItem) => {
        if (historyItem.user._id == this._userInfo.user._id) {
          return;
        }
        const toast: ToastOptions = {
          title: historyItem.user.username,
          msg: historyItem.message,
          showClose: true,
          timeout: 5000,
          theme: 'bootstrap',
          // onAdd: (toast:ToastData) => {
          //     console.log('Toast ' + toast.id + ' has been added!');
          // },
          // onRemove: function(toast:ToastData) {
          //     console.log('Toast ' + toast.id + ' has been removed!');
          // }
        };
        // TODO don't display if it's your own but then we need to make sure dest cards and claiming routes posts green ones
        // if (historyItem.user.username != this._userInfo.user.username) {
        // currToastyService.info(toast);
        // }
        currToastyService.info(toast);
      });
    }
  }
}
