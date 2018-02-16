import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { hasCookie } from '../core/utils/cookies';
import { ServerProxy } from '../services/server_proxy.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _router: Router, private _serverProxy: ServerProxy) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const cookieExists = hasCookie('connect.sid');

        if (cookieExists) {
            console.log('loggedIn');
            return true;
        } else {
            console.log('loggedOut');
            this._router.navigate(['/login'], {skipLocationChange: true});
            return false;
        }
    }
}
