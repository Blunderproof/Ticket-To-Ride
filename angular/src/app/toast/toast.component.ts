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
    private socket: SocketCommunicator) {
    // Assign the selected theme name to the `theme` property of the instance of ToastyConfig.
    // Possible values: default, bootstrap, material
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = "bottom-left";
  }

  ngOnInit() {
    this.sockets();
  }
  sockets() {
    this.socket.updateGameHistory((data: Array<Message>) => {
      if (data.length > this.historyList.length) {
        const newItemCount = data.length - this.historyList.length;
        this.historyList = data;
        this.itemsToToast = data.reverse().slice(this.historyList.length - newItemCount, this.historyList.length);
        this.addToast();
      } else {
        this.historyList = data;
      }
    });
  }

  addToast() {
    const currToastyService = this.toastyService;
    if (this.itemsToToast != null) {
      this.itemsToToast.forEach(function(historyItem) {
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
        currToastyService.success(toast);
      });
    }
  }
}
