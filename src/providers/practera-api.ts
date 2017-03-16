import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs";
import {DataProcessor} from "./data-processor";
import {UserStorage} from "./user-storage";

/*
 Generated class for the PracteraApi provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PracteraApi {
    private replaySubject = new ReplaySubject(1);
    private APP_KEY = "6862124bfe";

    private AUTHS_END_POINT = "https://sandbox.practera.com/api/auths.json";
    private USER_END_POINT = "https://sandbox.practera.com/api/users.json";
    private MILESTONES_END_POINT = "https://sandbox.practera.com/api/milestones.json";
    private ACTIVITIES_END_POINT = "https://sandbox.practera.com/api/activities.json";
    private SESSION_END_POINT = "https://sandbox.practera.com/api/sessions.json";
    private ACHIEVEMENT_END_POINT = "https://sandbox.practera.com/api/achievements.json";
    private USER_ACHIEVEMENT_END_POINT = "https://sandbox.practera.com/api/user_achievements.json";

    constructor(public http: Http, private dataProcessor: DataProcessor, private userStorage: UserStorage) {
        console.log('Hello PracteraApi Provider');
    }

    // broadcast null if login successfully, otherwise error message
    // save user information to local storage
    public logIn(email, password){
        console.log("log begins");
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('appkey', this.APP_KEY);

        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('data[User][email]', email);
        urlSearchParams.append('data[User][password]', password);
        let body = urlSearchParams.toString();

        let observer = this.http.post(this.AUTHS_END_POINT,  body, {headers: headers});
        this.replaySubject = new ReplaySubject(1);
        observer.map((response:any) => response.json())
            .subscribe(data => {
                console.log("log done");
                this.dataProcessor.processLogIn(data);
                this.replaySubject.next(null);
            }, err =>{
                this.replaySubject.error(err);
            })

        return this.replaySubject;
    }

    public getUserInfo(){
        console.log("user begins");
        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');

        headers.append('appkey', this.APP_KEY);
        headers.append('apikey', this.userStorage.getUserApiKey());
        headers.append('timelineid', this.userStorage.getTimelineIds()[0]);

        let observer = this.http.get(this.USER_END_POINT, {headers: headers});
        this.replaySubject = new ReplaySubject(1);
        observer.map((response:any) => response.json())
            .subscribe(
                data => {
                    console.log("user done");
                    this.dataProcessor.processUser(data);
                    this.replaySubject.next(null);
                }, error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }

    public getMilestones(){
        console.log("milestones begins");
        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');

        headers.append('appkey', this.APP_KEY);
        headers.append('apikey', this.userStorage.getUserApiKey());
        headers.append('timelineid', this.userStorage.getSelectedTimeline());

        let observer = this.http.get(this.MILESTONES_END_POINT, {headers: headers});
        this.replaySubject = new ReplaySubject(1);
        observer.map((response:any) => response.json())
            .subscribe(
                res => {
                    console.log("milestones done");
                    this.dataProcessor.processMilestone(res.data);
                    this.replaySubject.next(null);
                }, error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }

    public getActivities(){
        console.log("activities begins");

        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        headers.append('appkey', this.APP_KEY);
        headers.append('apikey', this.userStorage.getUserApiKey());
        headers.append('timelineid', this.userStorage.getSelectedTimeline());

        let params: URLSearchParams = new URLSearchParams();
        let milestoneIds = this.userStorage.getMilestone();

        //TODO: the api is supposed to work with array, but whatever, I can't control the API =))
        // for(let i = 0; i < milestoneIds.length; i++){
        //     params.append('milestone_id[]', milestoneIds[i].toString());
        // }
        //This code works with single milestone_id
        params.append('milestone_id', milestoneIds[0].toString());

        let observer = this.http.get(this.ACTIVITIES_END_POINT, {headers: headers, search: params});
        this.replaySubject = new ReplaySubject(1);
        observer.map((response:any) => response.json())
            .subscribe(
                res => {
                    console.log("activities done");
                    this.dataProcessor.processActivities(res.data);
                    this.replaySubject.next(null);
                }, error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }

    public getSession(){
        console.log("session begins");

        let activityIds = this.userStorage.getActivityIds();
        this.replaySubject = new ReplaySubject(1);

        if(activityIds.length == 0){
            this.replaySubject.next(null);
            return this.replaySubject;
        }

        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        headers.append('appkey', this.APP_KEY);
        headers.append('apikey', this.userStorage.getUserApiKey());
        headers.append('timelineid', this.userStorage.getSelectedTimeline());

        let params: URLSearchParams = new URLSearchParams();

        for(let i = 0; i < activityIds.length; i++){
            params.append('activity_id[]', activityIds[i].toString());
        }

        let observer = this.http.get(this.SESSION_END_POINT, {headers: headers, search: params});
        let result;
        observer.map((response:any) => response.json())
            .subscribe(
                res => {
                    console.log("session done");
                    result = this.dataProcessor.processSession(this.userStorage, res.data);
                    console.log("process data done");
                    this.replaySubject.next(result);
                }, error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }

    public getAchievements(){
        console.log("achievement begins");

        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        headers.append('appkey', this.APP_KEY);
        headers.append('apikey', this.userStorage.getUserApiKey());
        headers.append('timelineid', this.userStorage.getSelectedTimeline());

        let observer = this.http.get(this.ACHIEVEMENT_END_POINT, {headers: headers});

        let result;
        this.replaySubject = new ReplaySubject(1);
        observer.map((response:any) => response.json())
            .subscribe(
                res => {
                    console.log("achievement done");
                    result = this.dataProcessor.processAchievements(res.data);
                    this.replaySubject.next(result);
                }, error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }

    public getUserAchievement(){
        console.log("user achievement begins");

        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        headers.append('appkey', this.APP_KEY);
        headers.append('apikey', this.userStorage.getUserApiKey());
        headers.append('timelineid', this.userStorage.getSelectedTimeline());

        let observer = this.http.get(this.USER_ACHIEVEMENT_END_POINT, {headers: headers});

        let result;
        this.replaySubject = new ReplaySubject(1);
        observer.map((response:any) => response.json())
            .subscribe(
                res => {
                    console.log("user achievement done");
                    result = this.dataProcessor.processUserAchievements(res.data);
                    this.replaySubject.next(result);
                }, error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }
}
