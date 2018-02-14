import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { GametileComponent } from './gametile/gametile.component';
import { GamelistComponent } from './gamelist/gamelist.component';
import { PlayerlistComponent } from './playerlist/playerlist.component';
import { GamelobbyComponent } from './gamelobby/gamelobby.component';
import { LoginComponent } from './login/login.component';
import { GameTileComponent } from './game-tile/game-tile.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { PlayerInventoryComponent } from './player-inventory/player-inventory.component';
import { GameComponent } from './game/game.component';
import { TrainCardListComponent } from './train-card-list/train-card-list.component';
import { BankComponent } from './bank/bank.component';
import { OpponentCardComponent } from './opponent-card/opponent-card.component';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    GametileComponent,
    GamelistComponent,
    PlayerlistComponent,
    GamelobbyComponent,
    LoginComponent,
    GameTileComponent,
    ChatMsgComponent,
    PlayerInventoryComponent,
    GameComponent,
    TrainCardListComponent,
    BankComponent,
    OpponentCardComponent,
    MapComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
