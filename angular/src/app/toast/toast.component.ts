import { Component, OnInit } from '@angular/core';
import { GameHistory } from '../services/game-history.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { SocketCommunicator} from '../services/socket_communicator.service';
import { Message } from '../classes/message';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  historyList = [];
  itemsToToast = [];

  constructor(public _gameHistory: GameHistory,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private socketCommunicator: SocketCommunicator) {
      // Assign the selected theme name to the `theme` property of the instance of ToastyConfig.
      // Possible values: default, bootstrap, material
      this.toastyConfig.theme = 'bootstrap';
      this.toastyConfig.position = "bottom-left";
  }

  ngOnInit() {
    this.socketCommunicator.updateGameHistory((data: Array<Message>) => {
      if (data.length > this.historyList.length) {
        const length = this.historyList.length - 1;
        this.historyList = data;
        this.itemsToToast = data.slice(length);
      } else {
        this.historyList = data;
      }
      this.addToast();
    });
  }

  addToast() {
    const currToastyService = this.toastyService;
    // Just add default Toast with title only
    this.itemsToToast.forEach(function(historyItem) {
        const toast: ToastOptions = {
            title: historyItem.user.username,
            msg: historyItem.message,
            showClose: true,
            timeout: 2000,
            theme: 'bootstrap',
            // onAdd: (toast:ToastData) => {
            //     console.log('Toast ' + toast.id + ' has been added!');
            // },
            // onRemove: function(toast:ToastData) {
            //     console.log('Toast ' + toast.id + ' has been removed!');
            // }
        };
        currToastyService.success(toast);
      });
  }
}
