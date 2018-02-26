import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-message',
  templateUrl: './history-message.component.html',
  styleUrls: ['./history-message.component.scss']
})
export class HistoryMessageComponent implements OnInit {

  timestamp : string = "12:00:00";
  text : string = "Sample text, change me in the typescript file";
  sender: string = "BigKillz";

  constructor() { }

  ngOnInit() {
  }

}
