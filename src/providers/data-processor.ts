import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var _paq: any;

@Injectable()
export class DataProcessor {

    constructor() {
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

    processAchievements(){
        return [
            {
                name: 'Raw Meetball',
                description: 'Reached 10 points',
                unlocked: 'Unlocked in Feb 12, 2017',
                icon:'face1_selected'
            },
            {
                name: 'Hot Meetball',
                description: 'Reached 50 points',
                unlocked: 'Unlocked in Feb 28, 2017',
                icon:'face2_selected'
            },
            {
                name: 'Super Meetball',
                description: 'Reached 100 points',
                unlocked: null,
                icon:'face3_selected'
            },
            {
                name: 'Ultra Meetball',
                description: 'Reached 500 points',
                unlocked: null,
                icon:'face4_selected'
            },
            {
                name: 'Meetballfinity',
                description: 'Reached 10000 points',
                unlocked: null,
                icon:'face5_selected'
            }
        ]
    }

    processLeaderBoard(){
        let fakeData = [
            {
                name: 'Imaginary Friend 1',
                avatar: 'alison@intersective.com.png',
                points: 532
            },
            {
                name: 'Imaginary Friend 2',
                avatar: 'jason@intersective.com.png',
                points: 252
            },
            {
                name: 'Imaginary Friend 3',
                avatar: 'jun.lee.interns@intersective.com.png',
                points: 542
            },
            {
                name: 'Imaginary Friend 4',
                avatar: 'rachel@intersective.com.png',
                points: 652
            },
            {
                name: 'Imaginary Friend 5',
                avatar: 'wes@intersective.com.png',
                points: 528
            },
            {
                name: 'Me',
                avatar: 'zaw@intersective.com.png',
                points: 542
            },
        ];

        let sortedArray = fakeData.sort((a,b) =>{
            return a.points - b.points;
        })

        return sortedArray;
    }

    processEvents(data, email) {
        var events = [];

        if(data && data.items){
            data.items.forEach(function(item){
                var event = {};
                //Ignore no @Survey tag event
                if(item.description == null || !item.description.includes("@Survey")){
                    return;
                }else if(item.description && item.description.includes("@Survey")){
                    _paq.push(['trackEvent', 'Meetings', item.id]);
                    event['description'] = item.description.replace(/@Survey/g,'');
                }

                event['event_id'] = item.id;
                event['title'] = item.summary;

                var startTime = new Date(item.start.dateTime);
                var endTime = new Date(item.end.dateTime);

                let durationInMinute = Math.floor((endTime.valueOf()  - startTime.valueOf())/60000);
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

                var attendees = [];

                if(item.attendees){
                    item.attendees.forEach(function(attende){
                        if(attende.email == email){
                            attendees.unshift({ email: attende.email + ".png", response: attende.responseStatus});
                            if(attende.responseStatus === "accepted"){
                                event['RSVP'] = 1;
                            }else if(attende.responseStatus === "declined"){
                                event['RSVP'] = -1;
                            }else{
                                event['RSVP'] = 0;
                            }
                        }else{
                            attendees.push({ email: attende.email + ".png", response: attende.responseStatus});
                        }

                    });
                }else{
                    attendees.push({ email: email + ".png", response: "accepted"});
                }
                event['attendees'] = attendees;
                event['date'] = startTime.setHours(0,0,0,0);

                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                    "Saturday"];

                event['monthTitle'] =  monthNames[startTime.getMonth()];
                event['dayTitle'] = dayNames[startTime.getDay()] + ", " + startTime.getDate() + " " + startTime.getFullYear();
                event['status'] = item.status;

                events.push(event);
            });
        }

        let results = this.groupBy(events, 'date')
        results.sort((n1, n2) => n2.date - n1.date);

        for(let i = 0; i < results.length; i++){
            results[i].events.sort( (n1, n2) => n1.startTime - n2.startTime)
        }

        return results;


        // "needsAction" - The attendee has not responded to the invitation.
        // "declined" - The attendee has declined the invitation.
        // "tentative" - The attendee has tentatively accepted the invitation.
        // "accepted" -  The attendee has accepted the invitation.

        // return [{
        //     date: 1485349200000,
        //     events: [
        //         {
        //             ampm: "PM",
        //             date: 1485349200000,
        //             dayTitle: "Thursday, 26 2017",
        //             description: "",
        //             attendees: [
        //                 {
        //                     email: "beau@intersective.com.png",
        //                     response: "needsAction"
        //                 },
        //                 {
        //                     email: "hayley@intersective.com.png",
        //                     response: "needsAction"
        //                 },
        //                 {
        //                     email: "shawn@intersective.com.png",
        //                     response: "declined"
        //                 },
        //                 {
        //                     email: "tobias@intersective.com.png",
        //                     response: "declined"
        //                 },
        //                 {
        //                     email: "alex.dang.interns@intersective.com.png",
        //                     response: "tentative"
        //                 },
        //                 {
        //                     email: "srujana@intersective.com.png",
        //                     response: "tentative"
        //                 },
        //                 {
        //                     email: "rachel@intersective.com.png",
        //                     response: "accepted"
        //                 },
        //                 {
        //                     email: "jason@intersective.com.png",
        //                     response: "accepted"
        //                 },
        //                 {
        //                     email: "jun.lee.interns@intersective.com.png",
        //                     response: "accepted"
        //                 }
        //             ],
        //             duration: "1 Hour ",
        //             event_id: "vvdhbcnldnft2f06rqfm28e4tc",
        //             monthTitle: "January",
        //             startHour: "02",
        //             startMinute: "30",
        //             status: "confirmed",
        //             title: "Test Event (ignore me)",
        //             RSVP: 0
        //         },
        //         {
        //             ampm: "AM",
        //             date: 1485349200000,
        //             dayTitle: "Thursday, 26 2017",
        //             description: "",
        //             duration: "1 Hour ",
        //             event_id: "event_id_0",
        //             monthTitle: "January",
        //             startHour: "09",
        //             startMinute: "30",
        //             status: "confirmed",
        //             title: "Test Event (ignore me)",
        //             RSVP: 1
        //         },
        //         {
        //             ampm: "AM",
        //             date: 1485349200000,
        //             dayTitle: "Thursday, 24 2017",
        //             description: "",
        //             duration: "1 Hour ",
        //             event_id: "event_id_0",
        //             monthTitle: "January",
        //             startHour: "06",
        //             startMinute: "30",
        //             status: "confirmed",
        //             title: "Test Event (ignore me)",
        //             RSVP: -1
        //         }
        //     ]
        // }];
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
}
