import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { hasCookie } from '../core/utils/cookies';
import { ServerProxy } from '../services/server_proxy.service';
import { UserState } from '../classes/constants';

@Injectable()
export class AuthGuardService implements CanActivate {

    userState = UserState.LoggedOut;

    constructor(private _router: Router, private _serverProxy: ServerProxy) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._serverProxy.getUserGameStatus()
            .then((x: any) => {
                if (x.success) {
                    this.userState = x.result.status;
                    return this.checkState(route);
                } else {
                    console.log(x.message);
                    return false;
                }
            })
            .catch(x => {
                return false;
            });
    }

    checkState(route: ActivatedRouteSnapshot) {
        switch (this.userState) {
            case UserState.LoggedOut.valueOf():
                console.log('loggedOut');
                this._router.navigate(['/login'], {skipLocationChange: true});
                return false;
            case UserState.LoggedIn.valueOf():
                console.log('loggedIn');
                return true;
            case UserState.InGame.valueOf():
                console.log('InGame');
                console.log(route.component);
                if (route.routeConfig.path != "game") {
                    this._router.navigate(['/game']);
                }
                return true;
        }
    }
}
