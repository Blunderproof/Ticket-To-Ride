import { Component, OnInit } from '@angular/core';
import { ChatMsgComponent } from '../chat-msg/chat-msg.component';
import { Message } from '../classes/message';
import { User } from '../classes/user';
import { ServerProxy } from '../services/server_proxy.service';
import { FormBuilder, Validators } from '@angular/forms';
import { createFormGroup } from '../core/utils/forms';
import { SocketCommunicator } from '../services/socket_communicator.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageList = [];
  errorMessages = [];
  messageToSend = this._fb.control('', Validators.required);
  constructor(private _serverProxy: ServerProxy, private _fb: FormBuilder, private socket: SocketCommunicator) { }

  ngOnInit() {
    this.sockets();
  }

  sendMessage() {
    this.errorMessages = [];
    this._serverProxy.sendMessage(this.messageToSend.value)
      .then((x: any) => {
        if (!x.success) {
          this.errorMessages.push(x.message);
        }
      });
  }
  sockets() {
    this.socket.updateChatHistory(data => {
      console.log(data);
      this.messageList = data;
    });
  }
}
