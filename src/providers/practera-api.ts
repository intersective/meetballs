import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs";
import {DataProcessor} from "./data-processor";

/*
 Generated class for the PracteraApi provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PracteraApi {
    private APP_KEY = "6862124bfe";
    private AUTHS_END_POINT = "https://api.practera.com/api/auths.json";

    private replaySubject = new ReplaySubject(1);

    constructor(public http: Http, private dataProcessor: DataProcessor) {
        console.log('Hello PracteraApi Provider');
    }

    // broadcast null if login successfully, otherwise error message
    // save user information to local storage
    public logIn(email, password){
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('appkey', this.APP_KEY);

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('data[User][email]', email);
        urlSearchParams.append('data[User][password]', password);
        let body = urlSearchParams.toString();

        let observer = this.http.post(this.AUTHS_END_POINT,  body, {headers: headers});
        this.replaySubject = new ReplaySubject(1);
        let result;
        observer.map((response:any) => response.json())
            .subscribe(
                data => {
                    result = this.dataProcessor.processLogIn(data);
                    this.replaySubject.next(null);
                }, error => {
                    this.replaySubject.error(error);
                }
            )
        return this.replaySubject;
    }
}
