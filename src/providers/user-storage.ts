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

    public setMilestone(id){
        window.localStorage.setItem("milestoneIds", JSON.stringify(id));
    }

    public getMilestone(){
        return JSON.parse(window.localStorage.getItem("milestoneIds"));
    }

    public setActivityIds(data){
        window.localStorage.setItem("activityIds",  JSON.stringify(data));
    }

    public getActivityIds(){
        return JSON.parse(window.localStorage.getItem("activityIds"));
    }

    public setSelectedTimelineIndex(index){
        window.localStorage.setItem("selectedTimelineIndex", index);
    }

    public getSelectedTimelineIndex(){
        return window.localStorage.getItem("selectedTimelineIndex");
    }

    public getSelectedTimeline(){
        return this.getTimelineIds()[this.getSelectedTimelineIndex()] ;
    }

    public clearUser(){
        window.localStorage.setItem("practeraUser", null);
    }

    // Save user information
    public setPracteraUser(user){
        let practeraUser = this.getPracteraUser();
        practeraUser.name = user.data.User.name;
        practeraUser.email = user.data.User.email;
        practeraUser.image = user.data.User.image;
        practeraUser.role = user.data.User.role;

        window.localStorage.setItem("practeraUser", JSON.stringify(practeraUser));
    }

    // Save login information
    public setLoginUser(user){
        let practeraUser = {
            'apikey': user.data.apikey,
            'timelines':user.data.Timelines
        }
        window.localStorage.setItem("practeraUser", JSON.stringify(practeraUser));
    }

    public getPracteraUser(){
        return JSON.parse(window.localStorage.getItem("practeraUser") || '{}');
    }

    public getUserApiKey(){
        let user = this.getPracteraUser();
        return user ? user.apikey : "";
    }

    public getTimelineIds(){
        let user = this.getPracteraUser();
        return user ? user.timelines.map(function(data){return data.Timeline.id}) : "";
    }

    public getTimelineArray(){
        let user = this.getPracteraUser();
        return user ? user.timelines : [];
    }
}
