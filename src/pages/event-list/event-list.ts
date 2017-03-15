import { Component } from '@angular/core';
import {
    NavController, ActionSheetController
} from 'ionic-angular';
import {UserStorage} from "../../providers/user-storage";
import {SheetsuApi} from "../../providers/sheetsu-api";
import {HomePage} from "../home/home";
import {PracteraApi} from "../../providers/practera-api";
import {CustomLoading} from "../../providers/custom-loading";

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
    private actionSheet;
    private entries;
    private timelineTitle;
    private timelineArray;

    constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController,private userStorage: UserStorage,
                private sheetsuAPI:SheetsuApi, private practeraApi: PracteraApi, private customLoading: CustomLoading) {
        this.userStorage.setSelectedTimelineIndex(0);
    }

    ionViewDidLoad() {
        this.timelineArray = this.userStorage.getTimelineArray();
    }

    ionViewWillEnter(){
        this.updateTimelineTitle();
        this.loadSession();
    }

    updateTimelineTitle(){
        this.timelineTitle = this.timelineArray[this.userStorage.getSelectedTimelineIndex()].Program.name;
    }

    //clear data in user storage
    //push user back to log in page
    logOut(){
        this.userStorage.clearUser();
        this.navCtrl.pop(HomePage);
    }

    onTimelineClick(){
        this.actionSheet = this.actionSheetCtrl.create({
            title: 'Select your timeline',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        for(let i = 0; i < this.timelineArray.length; i++){
            this.actionSheet.addButton({
                text: this.timelineArray[i].Program.name,
                handler: () => {
                    this.onSelectTimeline(i);
                }
            });
        }

        this.actionSheet.present();
    }

    onSelectTimeline(i){
        this.userStorage.setSelectedTimelineIndex(i);
        this.updateTimelineTitle();
        this.loadSession();
    }

    loadSession(refresher?){
        this.customLoading.show("Please wait...");
        let milestoneObservable = this.practeraApi.getMilestones();

        milestoneObservable.subscribe(
            () =>{
                let activitiesObservable = this.practeraApi.getActivities();

                activitiesObservable.subscribe(()=>{
                    let sessionObservable = this.practeraApi.getSession();

                    sessionObservable.subscribe(
                        data =>{
                            this.entries = data;
                            this.customLoading.dismiss();
                            this.cancelRefresher(refresher);
                        }, err =>{
                            this.showError(err, refresher);
                        }
                    )
                }, err=>{
                    this.showError(err, refresher);
                });
            },
            err =>{
                this.showError(err, refresher);
            }
        );
    }

    showError(err, refresher?){
        this.cancelRefresher(refresher);
        this.customLoading.dismiss();
        alert(err);
    }

    cancelRefresher(refresher?){
        if(refresher != null){
            refresher.complete();
        }
    }
}
