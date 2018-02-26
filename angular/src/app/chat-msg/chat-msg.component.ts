import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss']
})
export class ChatMsgComponent implements OnInit {

  timestamp : string = "12:00:00";
  text : string = "Sample text, change me in the typescript file";
  sender: string = "BigKillz";

  constructor() { }

  ngOnInit() {
  }

}
