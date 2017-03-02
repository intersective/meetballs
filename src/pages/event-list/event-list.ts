import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {GoogleApi} from "../../providers/google-api";
import {UserStorage} from "../../providers/user-storage";
import {SheetsuApi} from "../../providers/sheetsu-api";
import {DataProcessor} from "../../providers/data-processor";
import {LeaderBoardPage} from "../leader-board/leader-board";

/*
 Generated class for the EventList page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */


@Component({
    selector: 'page-event-list',
    templateUrl: 'event-list.html'
})

export class EventListPage {
    private points;

    constructor(public navCtrl: NavController, private googleApi:GoogleApi,
                private userStorage: UserStorage, private sheetsuAPI:SheetsuApi) {

    }

    private entries;

    ionViewDidLoad() {
        this.loadEvents(null);
        this.loadPoints();
    }

    loadPoints(){
        let userEmail = this.userStorage.getUser().email;
        let subscription = this.sheetsuAPI.getPointsByEmail(userEmail);

        subscription.subscribe(
            data => {
                this.points = data;
            },
            err => {
                alert(err);
            }
        )
    }

    onPointsClick(){
        this.navCtrl.push(LeaderBoardPage);
    }

    loadEvents(refresher){
        let subscription = this.googleApi.getEventsWithSurveyTag();
        subscription.subscribe(
                data => {
                    this.entries = data;
                },
                error => {
                    alert(error)
                },
                () => {
                    if( refresher!= null){
                        refresher.complete();
                    }
                }
            );
    }

    logOut(){
        let subscription = this.googleApi.logOut();
        subscription.subscribe(
            () => {
                this.navCtrl.pop(EventListPage);
            },
            error => {
                alert(error);
            }
        );
    }
}
