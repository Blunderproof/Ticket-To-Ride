import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GamelobbyComponent } from './gamelobby/gamelobby.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
}, {
  path: 'lobby',
  component: GamelobbyComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
