import { Injectable } from '@angular/core';

@Injectable()
export class GameHistory {

  historyOpen = false;

  constructor() { }

  toggleHistoryOpen() {
    this.historyOpen = !this.historyOpen;
  }
}
