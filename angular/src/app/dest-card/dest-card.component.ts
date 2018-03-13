import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DestinationCard } from '../classes/destination-card';

@Component({
  selector: 'app-dest-card',
  templateUrl: './dest-card.component.html',
  styleUrls: ['./dest-card.component.scss']
})
export class DestCardComponent implements OnInit {
  @Input() destCard: DestinationCard;
  @Output() update = new EventEmitter();

  selected = false;
  assetString = '../../assets/images/destcards/';
  city1: string;
  cityString: string;

  constructor() { }

  ngOnInit() {
    this.getAsset();
  }

  getAsset(){
    console.log(this.destCard);
    // this.city1 = this.destCard.city1.concat("-");
    // this.cityString = this.city1.concat(this.destCard.city2);
    // this.assetString = this.assetString.concat(this.cityString);
    // console.log(this.assetString);
  }


  selectDestCard() {
    this.selected = !this.selected;
    this.update.emit(this.selected);
  }

}
