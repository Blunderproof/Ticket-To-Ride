import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../services/user_info.service';


@Component({
  selector: 'app-dest-card-viewer',
  templateUrl: './dest-card-viewer.component.html',
  styleUrls: ['./dest-card-viewer.component.scss']
})
export class DestCardViewerComponent implements OnInit {
  constructor(public _userInfo: UserInfo) {}

  ngOnInit() {}

}
