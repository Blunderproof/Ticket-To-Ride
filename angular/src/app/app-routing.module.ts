import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GamelobbyComponent } from './gamelobby/gamelobby.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
}, {
  path: 'lobby',
  component: GamelobbyComponent
}, {
  path: 'game',
  component: GameComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
