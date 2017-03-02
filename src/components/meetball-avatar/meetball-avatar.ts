import {Component, Input, OnInit} from '@angular/core';

/*
 Generated class for the MeetballAvatar component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'meetball-avatar',
    templateUrl: 'meetball-avatar.html'
})
export class MeetballAvatarComponent implements OnInit{
    @Input() img;
    @Input() response;
    private color = "grey";
    constructor() {

    }

    // "needsAction" - The attendee has not responded to the invitation. - grey
    // "tentative" - The attendee has tentatively accepted the invitation. - grey

    // "declined" - The attendee has declined the invitation. -red
    // "accepted" -  The attendee has accepted the invitation. - green
    ngOnInit(){
        this.updateUI(this.response);
    }

    public updateUI(resp){
        this.response = resp;
        if(this.response === "accepted" || this.response == 1){
            this.color = "green";
        }else if(this.response === "declined"  || this.response == -1){
            this.color = "red";
        }
    }
}
