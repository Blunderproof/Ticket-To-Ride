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


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    GametileComponent,
    GamelistComponent,
    PlayerlistComponent,
    GamelobbyComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
