import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {EventListPage} from "../event-list/event-list";
import {GoogleApi} from "../../providers/google-api";
import {UserStorage} from "../../providers/user-storage";
import {CustomLoading} from "../../providers/custom-loading";
declare var _paq: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    constructor(public navCtrl: NavController, private googleApi: GoogleApi,
                private userStorage: UserStorage, private customLoading: CustomLoading) {

    }

    ionViewDidLoad(){
        // this.userStorage.setUser({
        //     email: "alex.dang.interns@intersective.com"
        // });
        // this.navCtrl.push(EventListPage);

        let subscription = this.googleApi.trySilenceLogIn();
        subscription.subscribe(
            user => {
                this.userStorage.setUser(user);
                _paq.push(['trackEvent', 'Account', user.email]);
                this.navCtrl.push(EventListPage);
            });
    }

    doGoogleLogin(){
        this.customLoading.show("Please wait...");
        let subscription = this.googleApi.logIn();
        subscription.subscribe(
            user => {
                this.userStorage.setUser(user);
                _paq.push(['trackEvent', 'Account', user.email]);
                this.customLoading.dismiss();
                this.navCtrl.push(EventListPage);
            },
            error => {
                this.customLoading.dismiss();
                alert(error);
            });
    }
}
