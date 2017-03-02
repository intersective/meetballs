import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SheetsuApi} from "../../providers/sheetsu-api";
import {UserStorage} from "../../providers/user-storage";
import {NavController} from "ionic-angular";
import {ResultPage} from "../../pages/result/result";
import {FeedbackPage} from "../../pages/feedback/feedback";
import {DataProcessor} from "../../providers/data-processor";
import {GoogleApi} from "../../providers/google-api";
import {MeetballAvatarComponent} from "../meetball-avatar/meetball-avatar";
import {CustomLoading} from "../../providers/custom-loading";

@Component({
    selector: 'event-child',
    templateUrl: 'event-child.html'
})
export class EventChildComponent implements OnInit{
    @Input() entry;

    private avatarShow = false;
    private moreButtonShow = false;
    private iconName = "icon_more";
    private rsvpIcon = "";
    private noOfMorePeople = 0;
    private otherText = false;
    private results;

    @ViewChild("meetballAvatar") meetballAvatar: MeetballAvatarComponent;
    // @ViewChild("rsvpButton") rsvpButton: ElementRef;

    constructor(public navCtrl: NavController, private userStorage: UserStorage, private sheetsuAPI:SheetsuApi,
                private dataProcessor: DataProcessor, private googleApi: GoogleApi, private customLoading: CustomLoading) {
    }

    ngOnInit() {
        this.moreButtonShow = this.entry['attendees'] && this.entry['attendees'].length >= 4;
        if(this.entry['attendees'] != null){
            this.noOfMorePeople = this.entry['attendees'].length - 4;
        }
        this.otherText = this.moreButtonShow;
        this.rsvpIcon = this.entry['RSVP'] == 1 ? "icon_checked" : this.entry['RSVP'] == -1 ? "icon_unchecked" : "icon_unknown";
    }

    onMoreClick(){
        this.avatarShow = !this.avatarShow;
        if(this.iconName === "icon_more"){
            this.iconName = "icon_less";
        }else{
            this.iconName = "icon_more"
        }
        this.otherText = !this.otherText;
    }

    onEventClick(){
        let eventId = this.entry['event_id'];
        let userEmail = this.userStorage.getUser()['email'];

        this.customLoading.show("Please wait...");
        let observable = this.sheetsuAPI.getFeedbackByEventId(eventId);
        observable.subscribe(
                data => {
                    this.customLoading.dismiss();

                    let hasThisUserVoted = data[0];
                    this.results =  data[1];

                    if(hasThisUserVoted){
                        this.navCtrl.push(ResultPage, {results: this.results});
                    }else{
                        this.navCtrl.push(FeedbackPage, {event_id: eventId});
                    }
                },
                error => {
                    this.customLoading.dismiss();
                    if(error.status == 404){
                        this.navCtrl.push(FeedbackPage, {event_id: eventId});
                    }else{
                        alert(error)
                    }
                },
                () => {
                    console.log("Get feedback by event id " + eventId + "completed");
                }
            );
    }

    onRSVP(){
        this.customLoading.show("Sending your RSVP...");
        let eventId = this.entry['event_id'];
        let response = this.entry['RSVP'] == 0 ? "accepted" : this.entry['RSVP'] == 1 ? "declined" : "accepted";
        let subscription = this.googleApi.updateEventResponse(eventId,  response);

        subscription.subscribe(resp => {
            this.customLoading.dismiss();
            this.entry['RSVP'] = this.entry['RSVP'] == 0 ? 1 : this.entry['RSVP'] == 1 ? -1 : 1;
            this.rsvpIcon = this.entry['RSVP'] == 1 ? "icon_checked" : "icon_unchecked";
            this.meetballAvatar.updateUI(this.entry['RSVP']);
        }, error => {
            this.customLoading.dismiss();
            alert(error);
        });
    }
}