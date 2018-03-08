import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';


@Component({
  selector: 'app-opponent-card',
  templateUrl: './opponent-card.component.html',
  styleUrls: ['./opponent-card.component.scss']
})
export class OpponentCardComponent implements OnInit {
  @Input() user : User;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
    console.log("Created Opponent Card");
  }

  setColor(){

  }

}
