import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SheetsuApi} from "../../providers/sheetsu-api";
import {UserStorage} from "../../providers/user-storage";
import {NavController} from "ionic-angular";
import {ResultPage} from "../../pages/result/result";
import {FeedbackPage} from "../../pages/feedback/feedback";
import {DataProcessor} from "../../providers/data-processor";
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
        if(this.iconName === "icon_more"){
            this.iconName = "icon_less";
        }else{
            this.iconName = "icon_more"
        }
        this.otherText = !this.otherText;
    }

    onEventClick(){

    }

    onRSVP(){

    }
}
