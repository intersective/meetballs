import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserStorage provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserStorage {
    constructor(public http: Http) {
        console.log('Hello UserStorage Provider');
    }

    public setUser(user) {
        let user_data = {
            userID: user.userId,
            name: user.displayName,
            email: user.email,
            serverAuthCode: user.serverAuthCode,
            refreshToken: user.refreshToken,
            picture: user.imageUrl,
            accessToken: user.accessToken,
            idToken: user.idToken,
            expiredIn: Math.floor(Date.now() / 1000) + 3600,
            tokenType: "Bearer"
        }

        window.localStorage.setItem("user", JSON.stringify(user_data));
    }

    public getUser(){
        return JSON.parse(window.localStorage.getItem("user") || '{}');
    }
}
