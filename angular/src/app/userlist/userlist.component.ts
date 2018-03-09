import { Component, OnInit, Input } from '@angular/core';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() userList: User[];

  constructor() {
   }

  ngOnInit() {
  }

}
