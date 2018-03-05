import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../classes/message';
import { UserInfo } from '../services/user_info.service';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss']
})
export class ChatMsgComponent implements OnInit {
  @Input() message: Message;

  constructor(public _userInfo: UserInfo) { }

  ngOnInit() {
  }

}
