import {Component, Input} from '@angular/core';
import {NavController} from "ionic-angular";


/*
 Generated class for the EventDay component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'event-parent',
    templateUrl: 'event-parent.html'
})

export class EventParentComponent {
    @Input() entries;
    constructor(public navCtrl: NavController) {

    }
}
