import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
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
    private APP_KEY = "771a8452fa";
    private AUTHS_END_POINT = "sandbox.practera.com"; //"http://intranet.intersective.com/api/auths";

    private replaySubject = new ReplaySubject(1);

    constructor(public http: Http, private dataProcessor: DataProcessor) {
        console.log('Hello PracteraApi Provider');
    }

    // broadcast null if login successfully, otherwise error message
    // save user information to local storage
    public logIn(email, password){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('appkey', this.APP_KEY);

        let data = {
            "data": {
                "User": {
                    "email": email,
                    "password": password
                }
            }
        }

        let observer = this.http.post(this.AUTHS_END_POINT,  JSON.stringify(data), {headers: headers});
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

    get
}
