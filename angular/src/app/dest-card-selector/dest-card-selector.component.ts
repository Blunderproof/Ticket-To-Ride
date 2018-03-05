import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dest-card-selector',
  templateUrl: './dest-card-selector.component.html',
  styleUrls: ['./dest-card-selector.component.scss']
})
export class DestCardSelectorComponent implements OnInit {
  display = true;

  selectedCard1 = false;
  selectedCard2 = false;
  selectedCard3 = false;

  constructor() { }
  onCloseHandled() {
    this.display = false;
  }

  selectDestCard(event) {
    if (event.path[0].id === '1') {
      this.selectedCard1 = !this.selectedCard1;
      console.log(this.selectedCard1);
    } else if (event.path[0].id === '2') {
      this.selectedCard2 = !this.selectedCard2;
    } else if (event.path[0].id === '3') {
      this.selectedCard3 = !this.selectedCard3;
    }
    console.log(event.path[0].id);

  }

  openModal() {
    this.display = true;
  }

  ngOnInit() {
  }

}
