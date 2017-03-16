import {
    Component, Input, OnInit, ViewChild, trigger, transition, style, animate, state
} from '@angular/core';
import {SheetsuApi} from "../../providers/sheetsu-api";
import {UserStorage} from "../../providers/user-storage";
import {NavController} from "ionic-angular";
import {ResultPage} from "../../pages/result/result";
import {FeedbackPage} from "../../pages/feedback/feedback";
import {MeetballAvatarComponent} from "../meetball-avatar/meetball-avatar";
import {CustomLoading} from "../../providers/custom-loading";

@Component({
    selector: 'event-child',
    templateUrl: 'event-child.html',
    animations:[
        trigger(
            'toggle',
            [
                transition(
                    ':enter', [
                        style({transform: 'scale(1, 0)', opacity: 0, height: 0}),
                        animate('250ms', style({transform: 'scale(1, 1)', opacity: 1, height: '*'}))
                    ]
                ),
                transition(
                    ':leave', [
                        style({transform: 'scale(1, 1)', 'opacity': 1, height: '*'}),
                        animate('250ms', style({transform: 'scale(1, 0)', opacity: 0, height: 0}))

                    ]
                )]
        ),
        trigger(
            'rotate',
            [
                state("collapsed", style({ transform: 'rotate(0)'})),
                state("expanded", style({ transform: 'rotate(180deg)'})),
                transition(
                    'collapsed <=> expanded', [
                        animate('250ms')
                    ]
                )]
        )
    ]
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
    private displayRSVPWrapper = "collapsed";

    @ViewChild("meetballAvatar") meetballAvatar: MeetballAvatarComponent;
    @ViewChild('rsvpWrapper') rsvpWrapper;
    constructor(public navCtrl: NavController, private userStorage: UserStorage, private sheetsuAPI:SheetsuApi,
                private customLoading: CustomLoading) {

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
        this.otherText = !this.otherText;
        if(this.iconName === "icon_more"){
            this.iconName = "icon_less";
        }else{
            this.iconName = "icon_more"
        }
    }

    onEventClick(){
        let eventId = this.entry['event_id'];

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

    }

    onDisplayRSVP(){
        this.displayRSVPWrapper = this.displayRSVPWrapper == "collapsed" ? "expanded" : "collapsed";
    }
}
