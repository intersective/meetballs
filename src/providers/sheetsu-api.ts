import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {DataProcessor} from "./data-processor";
import {ReplaySubject, Observable} from "rxjs";
import {UserStorage} from "./user-storage";

/*
 Generated class for the SheetsuApi provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class SheetsuApi {
    private API_URL = 'https://sheetsu.com/apis/v1.0/9fb72270cdd1';
    private replaySubject = new ReplaySubject(1);

    constructor(public http: Http, private dataProcessor: DataProcessor, private userStorage: UserStorage) {
        console.log('Hello SheetsuApi Provider');
    }

    getFeedbackByEventId(eventId){
        let url = this.API_URL + '/search/' + "?event_id=" + eventId;
        let observable =  this.http.get(url);

        this.replaySubject = new ReplaySubject(1);
        observable.map(response => response.json())
            .subscribe(
                data => {
                    let userEmail = this.userStorage.getEmail();
                    console.log("Get event by email " + userEmail);
                    let result = [];
                    result[1] = this.dataProcessor.processFeedbacks(data, userEmail);
                    result[0] = this.dataProcessor.hasUserVoted(data, userEmail);
                    this.replaySubject.next(result);
                },
                error => {
                    this.replaySubject.error(error);
                }
            )

        return this.replaySubject;
    }

    addFeedback(data){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.API_URL,  JSON.stringify(data), {headers: headers});
    }

    getPointsByEmail(email){
        let url = this.API_URL + '/search/' + "?user_email=" + email;
        let observable = this.http.get(url);
        let points = 0;

        this.replaySubject = new ReplaySubject(1);
        observable.map(response => response.json()).subscribe(
            data => {
                points = this.dataProcessor.processPoints(data);
                this.replaySubject.next(points);
            },
            error => {
                if(error.status == 404){
                    this.replaySubject.next(points);
                }else{
                    this.replaySubject.error(error);
                }
            }
        )

        return this.replaySubject;
    }

    getAchievements(email){
        let observable = Observable.create(obs =>{
            setTimeout(()=>{

            }, 1000);
            obs.next();
        })

        this.replaySubject = new ReplaySubject(1);
        observable.subscribe(
            data => {
                let results = this.dataProcessor.processAchievements();
                this.replaySubject.next(results);
            },
            error => {

                    this.replaySubject.error(error);

            }
        )

        return this.replaySubject;
    }

    getRankings(){
        let observable = Observable.create(obs =>{
            setTimeout(()=>{

            }, 1000);
            obs.next();
        })

        this.replaySubject = new ReplaySubject(1);
        observable.subscribe(
            data => {
                let results = this.dataProcessor.processLeaderBoard();
                this.replaySubject.next(results);
            },
            error => {

                this.replaySubject.error(error);

            }
        )

        return this.replaySubject;
    }
}