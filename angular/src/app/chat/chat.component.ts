import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
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
  @Input() inLobby: boolean;

  message: string = 'loading :(';

  messageList = [];
  errorMessages = [];
  messageToSend = this._fb.control('', Validators.required);
  playSound = false;

  constructor(private _serverProxy: ServerProxy, private _fb: FormBuilder, private socket: SocketCommunicator, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.message = 'all done loading :)'
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.sockets();
  }

  sendMessage() {
    this.errorMessages = [];
    this._serverProxy.sendMessage(this.messageToSend.value)
      .then((x: any) => {
        if (x.success) {
          this.messageToSend.reset();
        } else {
          this.errorMessages.push(x.message);
        }
      });
  }
  sockets() {
    this.socket.updateChatHistory(data => {
      if (this.messageList.length > 0 && data.length > this.messageList.length) {
        this.playSound = true;
        setTimeout(x => this.playSound = false, 500);
      }
      this.messageList = data;
    });
  }
}
