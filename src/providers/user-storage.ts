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

    public clearUser(){
        window.localStorage.setItem("practeraUser", null);
    }

    public setPracteraUser(user){
        window.localStorage.setItem("practeraUser", JSON.stringify(user));
    }

    public getPracteraUser(){
        return JSON.parse(window.localStorage.getItem("practeraUser") || '{}');
    }

    public getUserApiKey(){
        let user = this.getPracteraUser();
        return user ? user.data.apikey : "";
    }
}
