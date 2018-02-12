import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorsService } from './core/custom-validators.service';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { GameTileComponent } from './gametile/gametile.component';
import { GameListComponent } from './gamelist/gamelist.component';
import { PlayerListComponent } from './playerlist/playerlist.component';
import { GameLobbyComponent } from './gamelobby/gamelobby.component';
import { LoginComponent } from './login/login.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { ValidationMessagesComponent } from './core/validation-messages/validation-messages.component';

import { ServerProxy } from './services/server_proxy.service';
import { SocketCommunicator } from './services/socket_communicator.service';
import { ClientCommunicator } from './services/client_communicator.service';

import { PlayerInfo } from './services/player_info.service';
import { AuthGuardService } from './core/auth-guard.service';
import { ErrorsComponent } from './core/errors/errors.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    GameTileComponent,
    GameListComponent,
    PlayerListComponent,
    GameLobbyComponent,
    LoginComponent,
    GameTileComponent,
    ChatMsgComponent,
    ValidationMessagesComponent,
    ErrorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ServerProxy,
    CustomValidatorsService,
    SocketCommunicator,
    ClientCommunicator,
    PlayerInfo,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
