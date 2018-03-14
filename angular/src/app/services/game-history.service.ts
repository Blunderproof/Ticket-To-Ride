import { Injectable } from '@angular/core';

@Injectable()
export class GameHistory {

  historyOpen = false;
  historyList = [];

  constructor() { }

  toggleHistoryOpen() {
    this.historyOpen = !this.historyOpen;
  }

}
