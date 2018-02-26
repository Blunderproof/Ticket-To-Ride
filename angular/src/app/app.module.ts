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
import { UserListComponent } from './userlist/userlist.component';
import { GameLobbyComponent } from './gamelobby/gamelobby.component';
import { LoginComponent } from './login/login.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { UserInventoryComponent } from './user-inventory/user-inventory.component';
import { TrainCardListComponent } from './train-card-list/train-card-list.component';
import { BankComponent } from './bank/bank.component';
import { OpponentCardComponent } from './opponent-card/opponent-card.component';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ValidationMessagesComponent } from './core/validation-messages/validation-messages.component';

import { ServerProxy } from './services/server_proxy.service';
import { SocketCommunicator } from './services/socket_communicator.service';
import { ClientCommunicator } from './services/client_communicator.service';

import { UserInfo } from './services/user_info.service';
import { AuthGuardService } from './core/auth-guard.service';
import { ErrorsComponent } from './core/errors/errors.component';
import { GameComponent } from './game/game.component';
import { DestCardSelectorComponent } from './dest-card-selector/dest-card-selector.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { HistoryMessageComponent } from './history-message/history-message.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    GameTileComponent,
    GameListComponent,
    UserListComponent,
    GameLobbyComponent,
    LoginComponent,
    GameTileComponent,
    ChatMsgComponent,
    UserInventoryComponent,
    GameComponent,
    TrainCardListComponent,
    BankComponent,
    OpponentCardComponent,
    MapComponent,
    NavbarComponent,
    ValidationMessagesComponent,
    ErrorsComponent,
    DestCardSelectorComponent,
    GameHistoryComponent,
    HistoryMessageComponent,
  ],
  imports: [
    AngularSvgIconModule,
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
    UserInfo,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
