import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {UserStorage} from "./user-storage";
import moment from 'moment';

declare var _paq: any;

@Injectable()
export class DataProcessor {

    constructor(private userStorage: UserStorage) {
    }

    hasUserVoted(resp, email){
        var hasThisUserVoted = false;

        if(resp && resp.length){
            for (var i = 0, len = resp.length; i < len; i++) {
                if(resp[i] && resp[i].user_email == email){
                    hasThisUserVoted = true;
                }
            }
        }

        return hasThisUserVoted
    }

    processFeedbacks(resp, email){
        var results = {
            p1: 0, n1: 0,
            p2: 0, n2: 0,
            p3: 0, n3: 0,
            p4: 0, n4: 0,
            p5: 0, n5: 0,
            p6:[
                {count: 0, label: "Toxic"},
                {count: 0, label: "Could be better"},
                {count: 0, label: "Neutral"},
                {count: 0, label: "Pretty good"},
                {count: 0, label: "We had fun!"}
            ],
            total: 0
        };

        if(resp && resp.length){
            for (var i = 0, len = resp.length; i < len; i++) {
                if(resp[i]['useful_meeting'] == "TRUE"){
                    results.n1++;
                }

                if(resp[i]['clear_agenda'] == "TRUE"){
                    results.n2++;
                }

                if(resp[i]['desired_outcome'] == "TRUE"){
                    results.n3++;
                }

                if(resp[i]['take_note'] == "TRUE"){
                    results.n4++;
                }

                if(resp[i]['participant_contribute'] == "TRUE"){
                    results.n5++;
                }

                let answer = parseInt(resp[i]['atmosphere']);
                results.p6[answer].count++;
            }
        }

        results.p1 = parseInt(((results.n1 / resp.length) * 100).toFixed(0));
        results.p2 = parseInt(((results.n2 / resp.length) * 100).toFixed(0));
        results.p3 = parseInt(((results.n3 / resp.length) * 100).toFixed(0));
        results.p4 = parseInt(((results.n4 / resp.length) * 100).toFixed(0));
        results.p5 = parseInt(((results.n5 / resp.length) * 100).toFixed(0));
        results.total = resp.length;

        return results;
    }

    processPoints(data){
        let count = 0;
        for(let i = 0; i< data.length; i++){
            count += parseInt(data[i].points);
        }

        return count;
    }

    private groupBy(arr, key) {
        var newArr = [],
            Keys = {},
            i, j, cur;
        for (i = 0, j = arr.length; i < j; i++) {
            cur = arr[i];
            if (!(cur[key] in Keys)) {
                Keys[cur[key]] = { date: cur[key], events: [] };
                newArr.push(Keys[cur[key]]);
            }
            Keys[cur[key]].events.push(cur);
        }
        return newArr;
    }

    processLogIn(data?){
        this.userStorage.setLoginUser(data);
    }

    processUser(data?){
        this.userStorage.setPracteraUser(data);
    }

    processMilestone(data?){
        let milestoneIds = data.map(entry => entry.id);
        this.userStorage.setMilestone(milestoneIds);
    }

    processActivities(data?){
        let activityIds = data.map(activity => activity.Activity.id);
        this.userStorage.setActivityIds(activityIds);
    }

    processSession(userStorage, data?){
        var events = [];
        data.forEach(function(item){
            var event = {};

            event['title'] = item['title'];
            event['event_id'] = item['id'];
            event['description'] = item['description'];
            event['RSVP'] = item['isBooked'] ? 1 : -1;

            var attendees = [];
            attendees.push({ email: userStorage.getImage(), response: event['RSVP']});
            event['attendees'] = attendees;

            let startTimeInUTC =  moment.utc(item.start).toDate();
            let endTimeInUTC =  moment.utc(item.end).toDate();
            let startTime = moment(startTimeInUTC).local().toDate();
            let endTime = moment(endTimeInUTC).local().toDate();
            let durationInMinute = Math.floor((endTime.valueOf()  - startTime.valueOf())/60000);
            if(durationInMinute == 0){
                event['duration'] = "All day"
            }else{
                let hours = Math.floor(durationInMinute / 60);
                let minutes = durationInMinute % 60;
                event['duration'] = (hours > 0 ? hours + " Hour " : "") + (minutes > 0 ? minutes + " Minutes " : "");

                let startHour = startTime.getHours();
                event['startMinute'] = startTime.getMinutes().toString();

                if(startTime.getHours() >= 12){
                    event['ampm'] = "PM";
                    event['startHour'] = startHour % 12;
                }else{
                    event['ampm'] = "AM";
                    event['startHour'] = startHour;
                }

                if (event['startHour']   < 10) {
                    event['startHour']   = "0"+event['startHour'];
                }

                if (event['startMinute'] < 10) {
                    event['startMinute'] = "0"+event['startMinute'];
                }
            }

            event['date'] = startTime.setHours(0,0,0,0);
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                "Saturday"];
            event['monthTitle'] =  monthNames[startTime.getMonth()];
            event['dayTitle'] = dayNames[startTime.getDay()] + ", " + startTime.getDate() + " " + startTime.getFullYear();

            events.push(event);
        });

        let results = this.groupBy(events, 'date');
        results.sort((n1, n2) => n2.date - n1.date);

        for(let i = 0; i < results.length; i++){
            results[i].events.sort( (n1, n2) => n1.startTime - n2.startTime)
        }

        console.log(results);
        return results;
    }

    processAchievements(data?){
        if(data == null){
            return JSON.parse('{}');
        }

        let achievementArray = data.map(entry => {return {
            id: entry.Achievement.id,
            name: entry.Achievement.name,
            description: entry.Achievement.description,
            unlocked: null,
            badge: entry.Achievement.badge
        }});

        this.userStorage.saveAchievements(achievementArray);

        return this.userStorage.getAchievements();
    }

    processUserAchievements(data?){
        if(data == null || data.Achievement == null){
            return JSON.parse('{}');
        }

        let achievementsArray = data.Achievement.map(entry => {return {
            id: entry["id"],
            name: entry["name"],
            description: entry["description"],
            unlocked: entry["earned"],
            badge: entry["badge"]
        }});
        this.userStorage.updateAchievements(achievementsArray);

        let points = data.total_points;
        this.userStorage.saveAchievementPoints(points);

        return this.userStorage.getAchievements();
    }
}
