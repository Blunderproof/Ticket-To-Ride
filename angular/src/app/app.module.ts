import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    ChatMsgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
