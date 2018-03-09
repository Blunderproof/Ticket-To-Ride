import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../classes/message';
import { UserInfo } from '../services/user_info.service';
import { ServerProxy } from '../services/server_proxy.service';

@Component({
  selector: 'app-history-message',
  templateUrl: './history-message.component.html',
  styleUrls: ['./history-message.component.scss']
})
export class HistoryMessageComponent implements OnInit {
  @Input() message: Message;

  constructor(public _userInfo: UserInfo, private _serverProxy: ServerProxy) { }

  ngOnInit() {
  }

}
