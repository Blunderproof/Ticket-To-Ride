import { Component, OnInit, Input } from '@angular/core';
import { SocketCommunicator } from '../services/socket_communicator.service';
import { Player } from '../classes/player';

@Component({
  selector: 'app-playerlist',
  templateUrl: './playerlist.component.html',
  styleUrls: ['./playerlist.component.scss']
})
export class PlayerListComponent implements OnInit {
  @Input() playerList: Player[];

  constructor() {
   }

  ngOnInit() {
  }

}
