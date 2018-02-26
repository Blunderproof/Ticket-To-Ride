import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {

  //TODO: Set up toggle from the button in the navbar when clicked.
  display='none';
  // display='block';

  //https://www.youtube.com/watch?v=I317BhehZKM&t=37s

  constructor() { }

  ngOnInit() {
  }

}
