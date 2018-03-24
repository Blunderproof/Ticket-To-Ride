import { Component, OnInit} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-user-inventory',
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.scss']
})
export class UserInventoryComponent implements OnInit {

  private destCardViewerSource = new BehaviorSubject<boolean>(false);
  displayDestCardViewer = this.destCardViewerSource.asObservable();

  constructor() { }

  openDestCardViewer(){
  }

  ngOnInit() {

  }

}
