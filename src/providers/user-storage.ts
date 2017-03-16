import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'underscore/underscore'

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

    public getImage(){
        //TODO: insert default url image here
        let defaultImageUrl = "http://content.internetvideoarchive.com/content/photos/9180/518268_027.jpg";
        let user = this.getPracteraUser();
        return user.image ? user.image : defaultImageUrl;
    }

    public getEmail(){
        let user = this.getPracteraUser();
        return user.email ? user.email : "";
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

    public saveAchievements(data){
        window.localStorage.setItem("achievements", JSON.stringify(data));
    }

    public getAchievements(){
        return JSON.parse(window.localStorage.getItem("achievements") || '{}');
    }

    public updateAchievements(data){
        let achievementObjects = _.indexBy(this.getAchievements(), 'id');
        let updateAchievementObjects = _.indexBy(data, 'id');

        let updatedArray = _.values(_.extend(achievementObjects, updateAchievementObjects));

        window.localStorage.setItem("achievements", JSON.stringify(updatedArray));
    }

    public saveAchievementPoints(points){
        window.localStorage.setItem("points", points);
    }

    public getAchievementPoints(){
        return parseInt(window.localStorage.getItem("points")) || 0;
    }
}
