import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {GooglePlus} from "ionic-native";
import {UserStorage} from "./user-storage";
import {Observable, ReplaySubject} from "rxjs";
import {DataProcessor} from "./data-processor";

/*
 Generated class for the GoogleApi provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class GoogleApi {
    private CLIENT_ID = "618067877415-h7ithi0j257h8dc9r6fpf1ohv4d4hdju.apps.googleusercontent.com";
    private CLIENT_SECRET = "PiVI4-TWVFsUT4GdVu8T5rEn";
    private REFRESH_TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token";
    private GOOGLE_SCOPE = "profile email https://www.googleapis.com/auth/calendar";
    public replaySubject = new ReplaySubject(1);

    constructor(public http: Http, private userStorage: UserStorage, private dataProcessor: DataProcessor) {
        this.userStorage = userStorage;
    }

    public logIn(){
        let subscription = Observable.fromPromise(
            GooglePlus.login({
                'scopes': this.GOOGLE_SCOPE,
                'webClientId': this.CLIENT_ID,
                'offline': true
            })
        );

        return subscription;
    }

    public logOut(){
        let subscription = Observable.fromPromise(
            GooglePlus.logout()
        );

        return subscription;
    }

    public trySilenceLogIn(){
        let subscription = Observable.fromPromise(
            GooglePlus.trySilentLogin({
                'scopes': this.GOOGLE_SCOPE,
                'webClientId': this.CLIENT_ID,
                'offline': true
            })
        );

        return subscription;
    }

    public getEventsWithSurveyTag(){
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        var oneWeekAhead = new Date();
        oneWeekAhead.setDate(oneWeekAhead.getDate() + 7);

        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.userStorage.getUser().accessToken);

        let api_url = "https://www.googleapis.com/calendar/v3/calendars/" + this.userStorage.getUser().email+ "/events";

        let params: URLSearchParams = new URLSearchParams();
        params.set('calendarId', 'primary');
        params.set('orderBy', 'startTime');
        params.set('singleEvents', 'true');
        params.set('showDeleted', "false");
        params.set('timeMin', oneWeekAgo.toISOString());
        params.set('timeMax', oneWeekAhead.toISOString());
        let observable =  this.http.get(api_url, {
            headers: headers,
            search: params
        });

        this.replaySubject = new ReplaySubject(1);
        let result = [];
        observable.map((response:any) => response.json())
            .subscribe(
            data => {
                let email = this.userStorage.getUser().email;
                result = this.dataProcessor.processEvents(data, email);
                this.replaySubject.next(result);
            }, error => {
                this.replaySubject.error(error);
            }
        )
        return this.replaySubject;
        //
        // let result = this.dataProcessor.processEvents(null, null);
        // this.replaySubject.next(result);
        // return this.replaySubject;
    }

    public updateEventResponse(eventId, response){
        let api_url = "https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventId;

        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.userStorage.getUser().accessToken);

        let requestBody = {
            "attendees": [
                {
                    "email": this.userStorage.getUser().email,
                    "responseStatus": response
                }
            ]
        }

        return this.http.patch(api_url, requestBody,{
            headers: headers
        });
    }
}
