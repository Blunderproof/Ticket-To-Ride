import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { hasCookie } from '../core/utils/cookies';
import { UserState } from '../classes/constants';
import { UserInfo } from '../services/user_info.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _router: Router, private _userInfo: UserInfo) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkState(route);
    }

    checkState(route: ActivatedRouteSnapshot) {
        return this._userInfo.getUserGameStatus()
            .then(state => {
                switch (state) {
                    case UserState.LoggedOut:
                        console.log('loggedOut');
                        this._router.navigate(['/login'], {skipLocationChange: true});
                        return false;
                    case UserState.LoggedIn:
                        console.log('loggedIn');
                        if (route.routeConfig.path == "game") {
                            this._router.navigate(['/lobby']);
                        }
                        return true;
                    case UserState.InGame:
                        console.log('InGame');
                        console.log(route.component);
                        if (route.routeConfig.path != "game") {
                            this._router.navigate(['/game']);
                        }
                        return true;
                }
            })
            .catch((x: any) => {
                console.log(x.message);
                return false;
            });
    }
}
