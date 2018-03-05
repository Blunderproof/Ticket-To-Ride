import { Component, OnInit } from '@angular/core';
import { ChatMsgComponent } from '../chat-msg/chat-msg.component';
import { Message } from '../classes/message';
import { User } from '../classes/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageList = [];

  constructor() { }

  ngOnInit() {
    let message = new Message();
    let user = new User();
    user.id = '5a949b76768b744dc494be38';
    user.username = 'test';
    message.user = user;
    message.timestamp = new Date();
    message.message = 'Hi there!';
    this.messageList.push(message);
    message = new Message();
    user = new User();
    user.id = '5a9b67ac90754636984a3700';
    user.username = 'test1';
    message.user = user;
    message.timestamp = new Date();
    message.message = 'Hey back!!';
    this.messageList.push(message);
  }

}
