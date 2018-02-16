import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GameLobbyComponent } from './gamelobby/gamelobby.component';
import { AuthGuardService } from './core/auth-guard.service';
import { GameComponent } from './game/game.component';

const routes: Routes = [{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'lobby',
  component: GameLobbyComponent,
  canActivate: [AuthGuardService]
}, {
  path: 'game',
  component: GameComponent,
  canActivate: [AuthGuardService]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
