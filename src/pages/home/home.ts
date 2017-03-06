import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {EventListPage} from "../event-list/event-list";
import {GoogleApi} from "../../providers/google-api";
import {UserStorage} from "../../providers/user-storage";
import {CustomLoading} from "../../providers/custom-loading";
import {PracteraApi} from "../../providers/practera-api";
declare var _paq: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    private email;
    private password;

    constructor(public navCtrl: NavController, private prateraApi: PracteraApi,
                private userStorage: UserStorage, private customLoading: CustomLoading) {

    }

    ionViewDidLoad(){
        //TODO: silence log in
    }

    doPracteraLogin(){
        this.email = "meetballs@intersective.com";
        this.password = "12341234";

        this.customLoading.show("Please wait...");
        let observer = this.prateraApi.logIn(this.email, this.password);

        observer.subscribe(
            data =>{
                this.customLoading.dismiss();
                this.navCtrl.push(EventListPage);
            },
            err =>{
                this.customLoading.dismiss();
                alert(err);
            }
        );
    }
}
