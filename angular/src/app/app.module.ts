import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorsService } from './core/custom-validators.service';

import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { GametileComponent } from './gametile/gametile.component';
import { GamelistComponent } from './gamelist/gamelist.component';
import { PlayerlistComponent } from './playerlist/playerlist.component';
import { GamelobbyComponent } from './gamelobby/gamelobby.component';
import { LoginComponent } from './login/login.component';
import { GameTileComponent } from './game-tile/game-tile.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { ServerProxy } from './services/server_proxy.service';


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
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [
    ServerProxy,
    CustomValidatorsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
