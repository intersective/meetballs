import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserStorage} from "../../providers/user-storage";
import {SheetsuApi} from "../../providers/sheetsu-api";
import {LeaderBoardPage} from "../leader-board/leader-board";
import {HomePage} from "../home/home";

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

    constructor(public navCtrl: NavController, private userStorage: UserStorage, private sheetsuAPI:SheetsuApi) {

    }

    private entries;

    ionViewDidLoad() {

    }

    loadPoints(){

    }

    onPointsClick(){
        this.navCtrl.push(LeaderBoardPage);
    }

    loadEvents(refresher){

    }

    //clear data in user storage
    //push user back to log in page
    logOut(){
        this.userStorage.clearUser();
        this.navCtrl.pop(HomePage);
    }
}
