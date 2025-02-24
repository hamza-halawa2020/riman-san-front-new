import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoginService } from '../login-page/login.service';

@Injectable({
    providedIn: 'root',
})
export class FavouriteResolver implements Resolve<string> {
    constructor(private authService: LoginService) {}

    resolve(): string {
        return this.authService.isLoggedIn() ? 'loggedIn' : 'guest';
    }
}
