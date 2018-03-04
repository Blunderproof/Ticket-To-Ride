import { Component, OnInit } from '@angular/core';
import { ChatMsgComponent } from '../chat-msg/chat-msg.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageList = [];

  constructor() { }

  ngOnInit() {
  }

}
