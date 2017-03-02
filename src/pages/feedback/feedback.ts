import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {UserStorage} from "../../providers/user-storage";
import {SheetsuApi} from "../../providers/sheetsu-api";
import {DataProcessor} from "../../providers/data-processor";
import {ResultPage} from "../result/result";
import {CustomLoading} from "../../providers/custom-loading";

declare var _paq: any;
@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html'
})
export class FeedbackPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private userStorage: UserStorage,
                private sheetsuAPI: SheetsuApi, private customLoading: CustomLoading) {}
    private results;

    private submitData = {
        user_email: "",
        event_id: "",
        useful_meeting: true,
        clear_agenda: true,
        desired_outcome: true,
        take_note: true,
        participant_contribute: true,
        atmosphere: 4,
        points: Math.floor((Math.random() * 10) + 1)
    }

    ionViewDidLoad() {
    }

    onSubmit(){
        this.customLoading.show("Submitting your feedback...");
        this.submitData.user_email = this.userStorage.getUser().email;
        this.submitData.event_id = this.navParams.get('event_id');

        let subscription = this.sheetsuAPI.addFeedback(this.submitData);
        subscription.map((response: any) => response.json())
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    _paq.push(['trackEvent', 'Feedback', 'Received unsuccessfully']);
                    alert(error)
                },
                () => {
                    _paq.push(['trackEvent', 'Feedback', 'Received successfully']);
                    this.customLoading.dismiss();
                    this.customLoading.show("Getting feedback...");

                    let eventId = this.navParams.get('event_id');
                    let observable = this.sheetsuAPI.getFeedbackByEventId(eventId);

                    observable.subscribe(
                            data => {
                                this.customLoading.dismiss();
                                this.results =  data[1];
                                this.navCtrl.push(ResultPage, {results: this.results}).then(() => {
                                    const startIndex = this.navCtrl.getActive().index - 1;
                                    this.navCtrl.remove(startIndex, 1);
                                });
                            },
                            error => {
                                this.customLoading.dismiss();
                                alert(error)
                            },
                            () => {
                                console.log("Get feedback by event id " + eventId + "completed");
                            }
                        );
                }
            );
    }
}
